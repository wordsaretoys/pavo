/**
	maintain dialogue tables and npc state
	
	@namespace PAVO
	@class dialogue
**/

PAVO.dialogue = new function() {

	var table = [];
	var state = [];

	/**
		parse a narrative block and generate the dialogue table
		
		@method init
		@param id DOM id of the div containing the narrative block
	**/

	this.init = function(id) {
		var entry = jQuery(id).html().split("\n");
		var data, tag, id, ch, wd, root;
		var keyword, record, req;
		var i, il, j, jl, phase = 0, lookup = {};

		// read narrative line by line
		for (i = 0, il = entry.length; i < il; i++) {
			data = jQuery.trim(entry[i]);
			if (data !== "") {

				// lines starting with "#" are directives to
				// change the context of the lines to follow
				
				if (data.charAt(0) === "#") {
					tag = data.split(" ");
					switch(tag[0]) {

					// specify which NPC to assign dialogue to
					case "#npc":
						id = tag[1];
						root = table[id] = [];
						req = [];
						break;
						
					// create and label a message for display
					// outside the dialogue area
					case "#message":
						id = tag[1];
						tag.splice(0, 2);
						lookup[id] = tag.join(" ");
						break; 
						
					// specify state flags required to
					// unlock NPC dialogue that follows
					case "#require":
						for (j = 1, jl = tag.length; j < jl; j++) {
							req.add(tag[j]);
						}
						break;

					// specify state flags to remove from 
					// required list
					case "#unrequire":
						for (j = 1, jl = tag.length; j < jl; j++) {
							req.del(tag[j]);
						}
						break;
					}
				
				} else {
					
					// without a "#" character, this line is either
					// a line of dialogue or a metadata descriptor
					if (!record) {
					
						// no record === metadata, so create a record
						// and add it to the current NPC
						record = {
							keyword: [],
							response: "",
							visited: false
						};
						root.push(record);
						
						// load any required state flags
						if (req.length > 0) {
							record.required = [];
							for (j = 0, jl = req.length; j < jl; j++) {
								record.required.add(req[j]);
							}
						}
						
						// for each metadata tag
						tag = data.split(" ");
						for (j = 0, jl = tag.length; j < jl; j++) {
							id = tag[j];
							ch = id.charAt(0);
							wd = id.substring(1);

							// some prefixes denote operations
							switch(ch) {

							// require specified state flag to select this entry							
							case "?":
								record.required = record.required || [];
								record.required.add(wd);
								break;
								
							// require specified state flag to be ABSENT for selection
							case "!":
								record.unwanted = record.unwanted || [];
								record.unwanted.add(wd);
								break;
							
							// add specified flag to state if entry activated
							case "+":
								record.addition = record.addition || [];
								record.addition.add(wd);
								break;
							
							// remove specified flag from state if entry activated
							case "-":
								record.deletion = record.deletion || [];
								record.deletion.add(wd);
								break;
								
							// display specified message if entry activated
							case "$":
								record.message = lookup[wd];
								break;
								
							// generate external event if line activated
							case "@":
								record.event = wd;
								break;

							// no prefix, treat tag as displayable keyword								
							default:
								record.keyword.push(id);
							}
						}
					} else {
						// record exists, so load the actual dialogue response
						// and get ready for the next entry
						record.response = data;
						record = undefined;
					}
				}
			}
		}
	};

	/**
		call a specified function for all available records in the table
		
		callback function may return false to cease enumeration, but MUST
		return true to continue
		
		@method enumerate
		@param subject name of the NPC to select records for
		@param callback user-supplied function to call
	**/

	this.enumerate = function(subject, callback) {
		var root = table[subject.name];
		var i, il, entry;
		for (i = 0, il = root.length; i < il; i++) {
			entry = root[i];
			// to be selected, the record must never have been activated AND
			// all required state is present AND
			// all unwanted state is absent
			if (!entry.visited &&
			(!entry.required || entry.required.match(state).length === entry.required.length) &&
			(!entry.unwanted || entry.unwanted.match(state).length === 0)) {
				if (!callback(entry)) {
					break;
				}
			}
		}
	};

	/**
		return a list of all keywords a given NPC can respond to
		
		@method getKeywords
		@param subject name of the NPC to return keywords for
		@return array of keywords
	**/

	this.getKeywords = function(subject) {
		var i, il, list = [];
		this.enumerate(subject, function(entry) {
			for (i = 0, il = entry.keyword.length; i < il; i++) {
				list.add(entry.keyword[i]);
			}
			return true;
		});
		list.sort(function(a, b) {
			return a > b ? 1 : (a < b ? -1 : 0);
		});
		return list;
	};

	/**
		select a response to a given keyword and execute associated operations
		
		note that this function is not idempotent and will change game state
		
		@method getResponse
		@param subject name of the NPC to respond for
		@param request keyword to generate response for
		@return string containing line of dialogue
	**/

	this.getResponse = function(subject, request) {
		var root = table[subject.name];
		var entry, i, il, st;
		
		
		if (request) {
			// find the first available record matching this keyword
			this.enumerate(subject, function(e) {
				entry = e;
				return !e.keyword.contains(request);
			});
		} else {
			// if no keyword, select the first record as a "greeting"
			entry = root[0];
		}
		
		// once we've matched a record, don't want to see it again
		entry.visited = true;

		// add any specified flags to state
		if (entry.addition) {
			for (i = 0, il = entry.addition.length; i < il; i++) {
				state.add(entry.addition[i]);
			}
		}

		// remove any specified flags from state
		if (entry.deletion) {
			for (i = 0, il = entry.deletion.length; i < il; i++) {
				state.del(entry.keyword[i]);
			}
		}
		
		// generate any specified events
		if (entry.event) {
			switch(entry.event) {
			case "fade":
				subject.active = false;
				table[subject.name] = [];
				break;
			case "end":
				PAVO.hud.end();
				break;
			}
		}		

		// display any specified messages
		if (entry.message) {
			PAVO.hud.addMessage(entry.message);
		}

		return entry.response;
	};

};


/**

	Dialogue Object
	Maintains the dialogue components.
	
**/

PAVO.dialogue = new function() {

	var table = [];
	var state = [];

	this.init = function(id) {
		var entry = jQuery(id).html().split("\n");
		var data, tag, id, ch, wd, root, sect;
		var keyword, record;
		var i, il, j, jl, phase = 0, lookup = {};

		for (i = 0, il = entry.length; i < il; i++) {
			data = jQuery.trim(entry[i]);
			if (data !== "") {

				if (data.charAt(0) === "#") {
					tag = data.split(" ");
					switch(tag[0]) {
				
					case "#npc":
						id = tag[1];
						root = table[id] = {
							current: "",
							section: {}
						};
						break;
						
					case "#start":
						root.current = tag[1];
						break;

					case "#section":
						id = tag[1];
						sect = root.section[id] = [];
						break;
						
					case "#message":
						id = tag[1];
						tag.splice(0, 2);
						lookup[id] = tag.join(" ");
						break; 
					}
				
				} else {
						
					if (!record) {
					
						record = {
							keyword: [],
							response: "",
							visited: false
						};
						sect.push(record);
						
						tag = data.split(" ");
						for (j = 0, jl = tag.length; j < jl; j++) {
							id = tag[j];
							ch = id.charAt(0);
							wd = id.substring(1);
							switch(ch) {
							
							case "?":
								record.required = record.required || [];
								record.required.push(wd);
								record.keyword.push(wd);
								break;
								
							case "!":
								record.unwanted = record.unwanted || [];
								record.unwanted.push(wd);
								break;
								
							case "-":
								record.deletion = record.deletion || [];
								record.deletion.push(wd);
								break;
								
							case "@":
								record.transit = wd;
								break;
								
							case "$":
								record.message = lookup[wd];
								break;
								
							default:
								record.keyword.push(id);
							}
						}
					} else {
						record.response = data;
						record = undefined;
					}
				}
			}
		}
	};

	this.getSection = function(subject) {
		var npc = table[subject.name];
		return npc.section[npc.current];
	};
	
	this.setSection = function(subject, section) {
		var npc = table[subject.name];
		npc.current = section;
	};
	
	this.enumerate = function(subject, callback) {
		var section = this.getSection(subject);
		var i, il, entry;
		for (i = 0, il = section.length; i < il; i++) {
			entry = section[i];
			if (!entry.visited && 
			(!entry.required || entry.required.match(state).length === entry.required.length) &&
			(!entry.unwanted || entry.unwanted.match(state).length === 0)) {
				if (!callback(entry)) {
					break;
				}
			}
		}
	};

	this.getKeywords = function(subject) {
		var i, il, word, list = [];
		this.enumerate(subject, function(entry) {
			for (i = 0, il = entry.keyword.length; i < il; i++) {
				word = entry.keyword[i];
				if (state.contains(word)) {
					list.add(word);
				}
			}
			return true;
		});
		list.sort(function(a, b) {
			return a > b ? 1 : (a < b ? -1 : 0);
		});
		return list;
	};

	this.getResponse = function(subject, request) {
		var section, entry, i, il, st;
		
		if (request) {
			this.enumerate(subject, function(e) {
				entry = e;
				return !e.keyword.contains(request);
			});
		} else {
			section = this.getSection(subject);
			entry = section[0];
		}
		
		entry.visited = true;

		for (i = 0, il = entry.keyword.length; i < il; i++) {
			state.add(entry.keyword[i]);
		}

		if (entry.deletion) {
			for (i = 0, il = entry.deletion.length; i < il; i++) {
				state.del(entry.keyword[i]);
			}
		}
		
		if (entry.transit) {
			this.setSection(subject, entry.transit);
			if (this.getSection(subject).length === 0) {
				subject.active = false;
			}
		}

		if (entry.message) {
			PAVO.hud.addMessage(entry.message);
		}

		return entry.response;
	};

};


/**

	Dialogue Object
	Maintains the dialogue components.
	
**/

PAVO.dialogue = new function() {

	var table = [];
	var state = [];

	this.init = function(id) {
		var entry = jQuery(id).html().split("\n");
		var data, tag, id, ch, wd, root;
		var keyword, record, req;
		var i, il, j, jl, phase = 0, lookup = {};

		for (i = 0, il = entry.length; i < il; i++) {
			data = jQuery.trim(entry[i]);
			if (data !== "") {

				if (data.charAt(0) === "#") {
					tag = data.split(" ");
					switch(tag[0]) {
				
					case "#npc":
						id = tag[1];
						root = table[id] = [];
						req = [];
						break;
						
					case "#message":
						id = tag[1];
						tag.splice(0, 2);
						lookup[id] = tag.join(" ");
						break; 
						
					case "#require":
						for (j = 1, jl = tag.length; j < jl; j++) {
							req.add(tag[j]);
						}
						break;

					case "#unrequire":
						for (j = 1, jl = tag.length; j < jl; j++) {
							req.del(tag[j]);
						}
						break;
					}
				
				} else {
						
					if (!record) {
					
						record = {
							keyword: [],
							response: "",
							visited: false
						};
						root.push(record);
						if (req.length > 0) {
							record.required = [];
							for (j = 0, jl = req.length; j < jl; j++) {
								record.required.add(req[j]);
							}
						}
						
						tag = data.split(" ");
						for (j = 0, jl = tag.length; j < jl; j++) {
							id = tag[j];
							ch = id.charAt(0);
							wd = id.substring(1);
							switch(ch) {
							
							case "?":
								record.required = record.required || [];
								record.required.add(wd);
								break;
								
							case "!":
								record.unwanted = record.unwanted || [];
								record.unwanted.add(wd);
								break;
								
							case "+":
								record.addition = record.addition || [];
								record.addition.add(wd);
								break;
								
							case "-":
								record.deletion = record.deletion || [];
								record.deletion.add(wd);
								break;
								
							case "$":
								record.message = lookup[wd];
								break;
								
							case "@":
								record.ending = true;
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

	this.enumerate = function(subject, callback) {
		var root = table[subject.name];
		var i, il, entry;
		for (i = 0, il = root.length; i < il; i++) {
			entry = root[i];
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

	this.getResponse = function(subject, request) {
		var root = table[subject.name];
		var entry, i, il, st;
		
		if (request) {
			this.enumerate(subject, function(e) {
				entry = e;
				return !e.keyword.contains(request);
			});
		} else {
			entry = root[0];
		}
		
		entry.visited = true;

		if (entry.addition) {
			for (i = 0, il = entry.addition.length; i < il; i++) {
				state.add(entry.addition[i]);
			}
		}

		if (entry.deletion) {
			for (i = 0, il = entry.deletion.length; i < il; i++) {
				state.del(entry.keyword[i]);
			}
		}
		
		if (entry.ending) {
			subject.active = false;
			table[subject.name] = [];
		}		

		if (entry.message) {
			PAVO.hud.addMessage(entry.message);
		}

		return entry.response;
	};

};


/**

	Dialogue Object
	Maintains the dialogue components.
	
**/

PAVO.dialogue = new function() {

	var table = [];
	var state = [];

	this.init = function(id) {
		var entry = jQuery(id).html().split("\n");
		var data, tag, id, root, sect;
		var keyword, record;
		var i, il, j, jl, phase = 0;

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
							if (id.charAt(0) === "@") {
								record.transit = id.substring(1);
							} else {
								record.keyword.push(tag[j]);
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

	this.getCurrent = function(subject) {
		var npc = table[subject.name];
		return npc.section[npc.current];
	}
	
	this.setCurrent = function(subject, section) {
		var npc = table[subject.name];
		npc.current = section;
	}

	this.getKeywords = function(subject) {
		var i, il, j, jl, entry, word, list = [];
		var section = this.getCurrent(subject);
		for (i = 0, il = section.length; i < il; i++) {
			entry = section[i];
			if (!entry.visited) {
				for (j = 0, jl = entry.keyword.length; j < jl; j++) {
					word = entry.keyword[j];
					if (state.contains(word)) {
						list.add(word);
					}
				}
			}
		}
		return list;
	};

	this.getResponse = function(subject, request) {
		var section = this.getCurrent(subject);
		var entry, i, il, st;
		
		if (request) {
		
			for (i = 0, il = section.length; i < il; i++) {
				entry = section[i];
				if (!entry.visited && entry.keyword.contains(request)) {
					break;
				}
			}
		
		} else {
			entry = section[0];
		}
		
		for (i = 0, il = entry.keyword.length; i < il; i++) {
			state.add(entry.keyword[i]);
		}
		entry.visited = true;

		if (entry.transit) {
			this.setCurrent(subject, entry.transit);
			if (this.getCurrent(subject).length === 0) {
				subject.active = false;
			}
		}

		return entry.response;
	};

};


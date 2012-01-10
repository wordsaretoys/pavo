/**

	Dialogue Object
	Maintains the dialogue components.
	
**/

PAVO.dialogue = new function() {

	var table = [];
	var state = [];

	this.init = function(id) {
		var entry = jQuery(id).html().split("\n");
		var data, header, op, id, root, sect;
		var keyword, record;
		var i, il, j, jl, phase = 0;

		for (i = 0, il = entry.length; i < il; i++) {
			data = jQuery.trim(entry[i]);
			if (data !== "") {

				if (data.charAt(0) === "#") {
					header = data.split(" ");
					op = header[0];
					id = header[1];
					switch(op) {
				
					case "#npc":
						root = table[id] = {
							current: "",
							section: {}
						};
						break;
						
					case "#start":
						root.current = id;
						break;

					case "#section":
						sect = root.section[id] = [];
						break;
						
					case "#meta":
						record = {
							command: "",
							keyword: [],
							response: "",
							visited: 0,
							argument: ""
						};
						sect.push(record);
						
						for (j = 1, jl = header.length; j < jl; j++) {
							op = header[j];
							switch(op) {
						
							case "@goto":
						
								record.command = "goto";
								j++;
								record.argument = header[j];
								break;
							
							case "@hello":
						
								record.command = "hello";
								break;
							
							default:
						
								record.keyword.push(header[j]);
							}
						}
					}

				} else {
					record.response += data;
				}
			}
		}
	};

	this.enumerate = function(subject, callback) {
		var npc = table[subject.name];
		var section = npc.section[npc.current];
		var i, il;
		for (i = 0, il = section.length; i < il; i++) {
			callback(section[i]);
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
		});
		return list;
	};

	this.getResponse = function(subject, request) {
		var record, list = [];
		var i, il, st;
		
		if (request) {
		
			this.enumerate(subject, function(entry) {
				if (entry.keyword.contains(request)) {
					list.push(entry);
				}
			});
		
		} else {

			this.enumerate(subject, function(entry) {
				if (entry.command === "hello") {
					list.push(entry);
				}
			});

		}
		
		list.sort(function(a, b) {
			return a.visited - b.visited;
		});
		record = list[0];
		record.visited++;

		for (i = 0, il = record.keyword.length; i < il; i++) {
			state.add(record.keyword[i]);
		}
//		state.del(request);

		if (record.command === "goto") {
			table[subject.name].current = record.argument;
			if (table[subject.name].section[record.argument].length === 0) {
				subject.active = false;
			}
		}

		return record.response;
	};

};


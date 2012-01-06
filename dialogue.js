/**

	Dialogue Object
	Maintains the dialogue components.
	
**/

PAVO.dialogue = new function() {

	var table = [];
	var state = [];

	this.init = function(id) {
		var entry = jQuery(id).html().split("\n");
		var data, header, keyword, root, sect, record;
		var i, il, j, jl, phase = 0;

		for (i = 0, il = entry.length; i < il; i++) {
			data = jQuery.trim(entry[i]);
			if (data !== "") {

				switch(phase) {
				case 0:
				
					header = data.split(" ");
					record = {
						command: "",
						keyword: [],
						response: ""
					};
					for (j = 0, jl = header.length; j < jl; j++) {
						switch(header[j]) {
						
						case "@npc":
						
							j++;
							table[header[j]] = {
								current: 0,
								section: []
							};
							root = table[header[j]];

							// fall through to allow @npc to create new section
							
						case "@section":
						
							root.section.push([]);
							sect = root.section[root.section.length - 1];
							break;
							
						case "@bump":
						
							record.command = "bump";
							break;
							
						case "@hello":
						
							record.command = "hello";
							break;
							
						case "@end":
						
							record.command = "end";
							break;
						
						default:
						
							record.keyword.push(header[j]);
						}
					}

					break;
					
				case 1:
					
					record.response = data;
					sect.push(record);
					break;
					
				}
				phase = phase ? 0 : 1;
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
		
		record = list[Math.floor(Math.random() * list.length)];

		for (i = 0, il = record.keyword.length; i < il; i++) {
			state.add(record.keyword[i]);
		}
		state.del(request);

		if (record.command === "bump") {
			table[subject.name].current++;
		}

		return record.response;
	};

};


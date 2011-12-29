/**

	Dialogue Object
	Maintains the dialogue components.
	
**/

PAVO.dialogue = new function() {

	var table = [];
	var state = [];

	this.init = function(id) {
		var entry = jQuery(id).html().split("\n");
		var data, header, record, pre, post;
		var i, il, phase = 0;

		for (i = 0, il = entry.length; i < il; i++) {
			data = jQuery.trim(entry[i]);
			if (data !== "") {

				switch(phase) {
				case 0:
				
					header = data.split("|");
					pre = jQuery.trim(header[1]);
					post = jQuery.trim(header[2]);
					record = {
						npc: jQuery.trim(header[0]),
						pre: pre !== "" ? pre.split(" ") : [],
						post: post !== "" ? post.split(" ") : []
					};
					break;
					
				case 1:
				
					record.request = data;
					break;
					
				case 2:
				
					record.response = data;
					record.visited = false;
					table.push(record);
					break;
				}
				phase = (phase < 2) ? phase + 1 : 0;
			}
		}
	};

	this.enumerate = function(subject, callback) {
		var i, il, record, common;
		var npc = subject.name;
		for (i = 0, il = table.length; i < il; i++) {
			record = table[i];
			if (record.npc === npc) {
				common = record.pre.match(state);
				if (common.length === record.pre.length) {
					callback(i, record);
				}
			}
		}
	};

	this.greet = function(subject) {
		var list = [];
		this.enumerate(subject, function(i, record) {
			if (record.request === "*") {
				list.push(record.response);
			}
		} );
		return list[Math.floor(Math.random() * list.length)];
	};

	this.ask = function(subject) {
		var list = [];
		this.enumerate(subject, function(i, record) {
			if (record.request !== "*") {
				list.push( {
					id: i,
					request: record.request,
					visited: record.visited
				} );
			}
		} );
		return list;
	};

	this.respond = function(id) {
		var record = table[id];
		var i, il, st;
		for (i = 0, il = record.post.length; i < il; i++) {
			st = record.post[i];
			if (st.charAt(0) === "!") {
				state.del(st.substr(1));
			} else {
				state.add(st);
			}
		}
		record.visited = true;
		return record.response;
	};

};


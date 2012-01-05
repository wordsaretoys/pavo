/**

	Dialogue Object
	Maintains the dialogue components.
	
**/

PAVO.dialogue = new function() {

	var table = [];
	var state = [];

	this.init = function(id) {
		var entry = jQuery(id).html().split("\n");
		var data, keyword, npc;
		var i, il, phase = 0;

		for (i = 0, il = entry.length; i < il; i++) {
			data = jQuery.trim(entry[i]);
			if (data !== "") {

				switch(phase) {
				case 0:
				
					keyword = data.split(" ");
					npc = keyword[0];
					table[npc] = table[npc] || {};
					keyword.splice(0, 1);
					break;
					
				case 1:
					
					table[npc].entry = table[npc].entry || [];
					table[npc].entry.push( {
						keyword: keyword,
						response: data,
						visited: false
					} );
					break;
					
				}
				phase = phase ? 0 : 1;
			}
		}
	};

	this.enumerate = function(subject, callback) {
		var i, il, record, common;
		var npc = subject.name;
		for (i = 0, il = table.length; i < il; i++) {
			record = table[i];
			if (!record.removed && record.npc === npc) {
				common = record.pre.match(state);
				if (common.length === record.pre.length) {
					callback(i, record);
				}
			}
		}
	};

	this.getRequests = function(subject) {
		var list = [];
		this.enumerate(subject, function(i, r) {
			if (r.request !== "*") {
				list.push( {
					request: r.request,
					visited: r.visited
				} );
			}
		} );
		list.sort( function(a, b) {
			if (a.visited === b.visited) {
				return a.request > b.request ? 1 : (a.request < b.request ? -1 : 0);
			} else {
				return a.visited - b.visited;
			}
		} );		
		return list;
	};

	this.getResponse = function(subject, request) {
		var record, list = [];
		var i, il, st;
		this.enumerate(subject, function(i, r) {
			if (r.request === request) {
				list.push(r);
			}
		} );
		record = list[Math.floor(Math.random() * list.length)];
		for (i = 0, il = record.post.length; i < il; i++) {
			st = record.post[i];
			if (st.charAt(0) === "!") {
				if (st.length === 1) {
					record.removed = true;
				} else {
					state.del(st.substr(1));
				}
			} else {
				state.add(st);
			}
		}
		record.visited = true;
		return record.response;
	};

};


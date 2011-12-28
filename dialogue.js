/**

	Dialogue Object
	Maintains the dialogue components.
	
**/

PAVO.dialogue = new function() {

	var set = {
		create: function() {
			var s = [];
			jQuery.extend(s, set);
			return s;
		},
		add: function(e) {
			if (!this.contains(e)) {
				this.push(e);
			}
		},
		del: function(e) {
			var i, il;
			for (i = 0, il = this.length; i < il; i++) {
				if (this[i] === e) {
					this.splice(i, 1);
					return;
				}
			}
		},
		copy: function(a) {
			var i, il;
			for (i = 0, il = a.length; i < il; i++) {
				this.add(a[i]);
			}
		},
		contains: function(e) {
			var i, il;
			for (i = 0, il = this.length; i < il; i++) {
				if (this[i] === e) {
					return true;
				}
			}
			return false;
		},
		punt: function() {
			return this[Math.floor(Math.random() * this.length)];
		},
		union: function(s) {
			var result = set.create();
			result.copy(this);
			result.copy(s);
			return result;
		},
		intersect: function(s) {
			var i, il, j, jl;
			var result = set.create();
			for (i = 0, il = this.length; i < il; i++) {
				if (s.contains(this[i])) {
					result.add(this[i]);
				}
			}
			return result;
		},
		complement: function(s) {
			var result = set.create();
			var i, il;
			result.copy(this);
			for (i = 0, il = s.length; i < il; i++) {
				result.del(s[i]);
			}
			return result;
		}
	};

	var self = this;
	var root = {};
	var state = set.create();
	
	this.init = function(id) {
		var text = jQuery(id).html();
		var line = text.split("\n");
		var character, header, name, state, nextstate, condition, phase;
		var i, il, j, jl, ln, nm;
		
		for (i = 0, il = line.length, phase = 0; i < il; i++) {
			ln = jQuery.trim(line[i]);
			if (ln != "") {
				if (ln.charAt(0) === "@") {
					header = ln.substr(1, ln.length).split(",");
					name = header[0];
					state = header[1] || "";
					root[name] = root[name] || {};
					root[name][state] = root[name][state] || [];
					character = root[name][state];
				} else {
					switch(phase) {
					case 0:
						condition = set.create();
						header = ln.split(" ");
						for (j = 0, jl = header.length; j < jl; j++) {
							if (header[j].charAt(0) === "#") {
								nextstate = header[j];
							} else {
								condition.add(header[j]);
							}
						}
						phase = 1;
						break;
					case 1:
						character.push( {
							statement: ln,
							condition: condition,
							nextstate: nextstate
						} );
						phase = 0;
						break;
					}
				}
			}
		}
	};
	
	this.handle = function(subject, request) {
		var search = set.create();
		var result = set.create();
		var topics = set.create();
		var states = set.create();
		var record = root[subject.name][subject.state];
		var i, il, len, st;

		if (request) {		
			search.copy(request.split(" "));
		} else {
			search = set.create();
		}
		len = search.length;
		
		for (i = 0, il = record.length; i < il; i++) {
			if (record[i].condition.intersect(search).length === len) {
				result.add(record[i]);
				topics.copy(record[i].condition);
			}
		}

		states = topics.intersect(state).complement(search);
		
		if (result.length === 1) {
			record = result[0];
			state.copy(record.condition);
			state.del("*");
			return {
				statement: record.statement
			};
		} else if (states.length === 0) {
			record = result.punt();
			state.copy(record.condition);
			state.del("*");
			return {
				statement: record.statement
			};
		} else {
			return {
				nextwords: states
			};
		}
	};

};


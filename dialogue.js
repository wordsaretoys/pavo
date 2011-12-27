/**

	Dialogue Object
	Maintains the dialogue components.
	
**/

PAVO.dialogue = new function() {

	var self = this;
	var lgen = new FOAM.Prng();
	var root = {};
	var state = [];
	
	var rankSort = function(a, b) {
		return a.rank < b.rank;
	};
	
	this.init = function() {
		var text = jQuery("#vignettes").html();
		var line = text.split("\n");
		var character, condition, statement, postwords;
		var i, il, j, jl, ln, phase, record, keyword;
		
		for (i = 0, il = line.length, phase = 0; i < il; i++) {
			ln = jQuery.trim(line[i]);
			if (ln != "") {
				if (ln.charAt(0) === "@") {
					nm = ln.substr(1, ln.length);
					root[nm] = root[nm] || {};
					character = root[nm];
				} else {
					switch(phase) {
					case 0:
						condition = ln.split(",");
						postwords = condition[1].split(" ");
						condition = condition[0].split(" ");
						phase = 1;
						break;
					case 1:
						record = {
							statement: ln,
							postwords: postwords
						};
						
						for (j = 0, jl = condition.length; j < jl; j++) {
							keyword = condition[j];
							character[keyword] = character[keyword] || [];
							character[keyword].push(record);
						}
						
						phase = 0;
						break;
					}
				}
			}
		}

		Array.prototype.selectRandom = function() {
			return this[Math.floor(Math.random() * this.length)];
		};
		
		Array.prototype.intersect = function(a) {
			var i, il, j, jl;
			var result = [];
			for (i = 0, il = this.length; i < il; i++) {
				for (j = 0, jl = a.length; j < jl; j++) {
					if (this[i] === a[j]) {
						result.push(this[i]);
					}
				}
			}
			return result;
		};

		Array.prototype.union = function(a) {
			var i, il;
			var result = [];
			for (i = 0, il = this.length; i < il; i++) {
				result.push(this[i]);
			}
			for (i = 0, il = a.length; i < il; i++) {
				result.push(a[i]);
			}
			return result;
		};

	};
	
	this.getWords = function(len) {
		var words = [];
		var i, il;
		state.sort(rankSort);
		il = Math.min(len, state.length);
		for (i = 0; i < il; i++) {
			words.push(state[i].word);
		}
		return words;
	};

	this.addToState = function(words) {
		var i, il, j, jl;
		for (i = 0, il = words.length; i < il; i++) {
			for (j = 0, jl = state.length; j < jl; j++) {
				if (state[j].word === words[i]) {
					state[j].rank++;
					break;
				}
			}
			if (j === jl) {
				state.push( { 
					word: words[i], 
					rank: 0
				} );
			}
		}
	};

	this.greet = function(subject) {
		var record = root[subject]["*"].selectRandom();
		this.addToState(record.postwords);
		return record.statement;
	};

	this.check = function(subject, word) {
		return root[subject][word];
	};

	this.respond = function(subject, words) {
		var result, key, c0, c1, record;
	
		// search based on strong AND
		key = words[0] + "+" + words[1];
		result = root[subject][key];
		if (!result) {
		
			// try weak AND
			c0 = root[subject][words[0]];
			c1 = root[subject][words[1]];
			result = c0.intersect(c1);
			
			if (result.length === 0) {
			
				// default to OR
				result = c0.union(c1);
				
			}
		}
			
		record = result.selectRandom();
		this.addToState(record.postwords);
		return record.statement;
	};
};

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
		return a.rank > b.rank;
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
						condition = ln.split(" ");
						phase++;
						break;
					case 1:
						statement = ln;
						phase++;
						break;
					case 2:
						postwords = ln.split(" ");
						
						record = {
							statement: statement,
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

	};
	
	this.getWords = function() {
		var words = [];
		var i, il;
		state.sort(rankSort);
		for (i = 0, il = state.length; i < il; i++) {
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
		var select = root[subject]["*"];
		var record = select.selectRandom();
		this.addToState(record.postwords);
		return record.statement;
	};

	this.respond = function(subject, words) {
		return "boner";
	};
};

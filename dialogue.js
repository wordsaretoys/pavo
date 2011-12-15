/**

	Dialogue Object
	Maintains the dialogue components.
	
**/

PAVO.dialogue = new function() {

	var self = this;

	var word = [
		"woman", "man", "child", "fire", "tree", "house", "sun", "cloud",
		"not",
		"happy", "angry",
		"walk", "sleep", "dream", "love", "kill",
		"pavo"
	];

	var hash = {};
	var lgen = new FOAM.Prng();

	this.init = function() {
		var i, il;
		for (i = 0, il = word.length; i < il; i++) {
			hash[word[i]] = i;
		}
	};

	this.generateWordMap = function(seed) {
		var prng = new FOAM.Prng(seed);
		var wmap = [];
		var i, j, l = word.length;
		for (i = 0; i < l; i++) {
			for (j = 0; j < l; j++) {
				if (i != j) {
					wmap.push( {
						i: i,
						j: j,
						c: prng.get()
					} );
				}
			}
		}
		return wmap;
	};
	
	this.listWords = function(start, len) {
		var wlist = [];
		var i, w, l;
		l = Math.min(word.length, start + len);
		for (i = start; i < l; i++)
			wlist.push(word[i]);
		return wlist;
	};

	this.respond = function(map, stmt) {
	
	};
};

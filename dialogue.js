/**

	Dialogue Object
	Maintains the dialogue components.
	
**/

PAVO.dialogue = new function() {

	var self = this;
	var lgen = new FOAM.Prng();

	var table = {};
	var state = [];	
	
	this.init = function() {
		var text = jQuery("#vignettes").html();
		var line = text.split("\n");
		var i, il, l, ph, nm, chr, rec;
		
		for (i = 0, il = line.length, ph = 0; i < il; i++) {
			l = jQuery.trim(line[i]);
			if (l != "") {
				if (l.charAt(0) === "@") {
					nm = l.substr(1, l.length);
					chr = table[nm] = [];
				} else {
					switch(ph) {
					case 0:
						rec = {};
						rec.condition = l;
						ph++;
						break;
					case 1:
						rec.statement = l;
						ph++;
						break;
					case 2:
						rec.postwords = l.split(" ");
						ph = 0;
						chr.push(rec);
						break;
					}
				}
			}
		}
	};
	
	this.getWords = function() {
		return state;
	};

	this.respond = function() {
	};
};

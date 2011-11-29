/**

	Dialogue Object
	Maintains the dialogue components.
	
**/

PAVO.dialogue = new function() {

	var TERMINATOR = ".";

	var table = [];

	var self = this;
	var prng = new FOAM.Prng();
	
	this.init = function() {
		var narrative, statement, keyword;
		var i, il, j, jl, k, kl, kw;

		narrative = jQuery.trim(jQuery("#narratives").html()).split("\n");
		for (i = 0, il = narrative.length; i < il; i++) {
		
			narrative[i] = jQuery.trim(narrative[i]);
			if (narrative[i].length) {
		
				statement = narrative[i].split(".");
				for (j = 0, jl = statement.length; j < jl; j++) {
		
					statement[j] = jQuery.trim(statement[j]);
					if (statement[j].length) {
				
						keyword = jQuery.trim(statement[j]).split(" ");
						for (k = 0, kl = keyword.length; k <= kl; k++) {
						
							keyword[k] = jQuery.trim(keyword[k]);
							kw = (k > 0) ? keyword[k - 1] : TERMINATOR;
							
							table.push( {
								narrative: i,
								statment: j,
								keyword: kw
							} );
						}
					}
				}
			}
		}
	};
	
	this.listKeywords = function(len, head) {
		var lookup = {};
		var list = [];
		var i, j, il, kw;
		head = head || TERMINATOR;
		
		for (i = 0, j = 0, il = table.length - 1; i < il && j < len; i++) {
			kw = table[i + 1].keyword;
			if (head === table[i].keyword && !lookup[kw]) {
				list.push(kw);
				lookup[kw] = true;
				j++;
			}
		}

		return list;
	};

	this.generateStatement = function() {
	
		var token = TERMINATOR;
		var stmt = "";
		var i, il, group, target;

		do {

			group = [];
			for (i = 0, il = table.length; i < il; i++) {
				if (table[i].keyword === token) {
					group.push(table[i + 1]);
				}
			}

			target = Math.floor(prng.get() * group.length);
			token = group[target].keyword;
			stmt = stmt + token + " ";

		} while (token !== TERMINATOR);
		
		return stmt;
	
	};

};

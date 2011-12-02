/**

	Dialogue Object
	Maintains the dialogue components.
	
**/

PAVO.dialogue = new function() {

	var TERMINATOR = ".";

	var table = [];

	var self = this;
	var prng = new FOAM.Prng();

	var random_sort = function(a, b) {
		return Math.round(prng.get() - prng.get());
	};
	
	this.init = function() {
		var statement, keyword;
		var i, il, j, jl;

		table.push(TERMINATOR);
				
		statement = jQuery.trim(jQuery("#narratives").html()).split(".");
		for (i = 0, il = statement.length; i < il; i++) {

			statement[i] = jQuery.trim(statement[i]);
			if (statement[i].length) {
		
				keyword = jQuery.trim(statement[i]).split(" ");
				for (j = 0, jl = keyword.length; j < jl; j++) {
				
					keyword[j] = jQuery.trim(keyword[j]);
					table.push(keyword[j]);
				}
				
				table.push(TERMINATOR);

			}
		}
	};
	
	this.selectNext = function(kw) {
		var list = [];
		var i, il;
		for (i = 0, il = table.length - 1; i < il; i++) {
			if (kw === table[i]) {
				list.push(table[i + 1]);
			}
		}
		return list;
	};
	
	this.listKeywords = function(len, head) {
		var lookup = {};
		var kwords = [];
		var i, j, il, kw, next;
		head = head || TERMINATOR;
		next = this.selectNext(head);
		next.sort(random_sort);
		
		for (i = 0, j = 0, il = next.length; i < il && j < len; i++) {
			kw = next[i];
			if (!lookup[kw]) {
				kwords.push(kw);
				lookup[kw] = true;
				j++;
			}
		}

		return kwords;
	};

	this.generateStatement = function() {
	
		var token = TERMINATOR;
		var stmt = "";
		var group, target;
		
		do {
			group = this.selectNext(token);
			target = Math.floor(prng.get() * group.length);
			token = group[target];
			stmt = stmt + token + " ";
		} while (token !== TERMINATOR);
		
		return stmt;
	};

};

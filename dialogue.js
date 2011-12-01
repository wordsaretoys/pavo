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
	
	var statement_sort = function(a, b) {
		return a.statement - b.statement;
	}
	
	var count_sort = function(a, b) {
		return a.count - b.count;
	}
	
	this.init = function() {
		var statement, keyword;
		var i, il, j, jl;

		table.push({
			statement: 0,
			keyword: TERMINATOR
		});
				
		statement = jQuery.trim(jQuery("#narratives").html()).split(".");
		for (i = 0, il = statement.length; i < il; i++) {

			statement[i] = jQuery.trim(statement[i]);
			if (statement[i].length) {
		
				keyword = jQuery.trim(statement[i]).split(" ");
				for (j = 0, jl = keyword.length; j < jl; j++) {
				
					keyword[j] = jQuery.trim(keyword[j]);
					table.push( {
						statement: i,
						keyword: keyword[j]
					} );
				}
				
				table.push({
					statement: i,
					keyword: TERMINATOR
				});

			}
		}
	};
	
	this.selectMatch = function(kw, list) {
		list = list | [];
		var i, il;
		for (i = 0, il = table.length - 1; i < il; i++) {
			if (kw === table[i].keyword) {
				list.push(table[i]);
			}
		}
		return list;
	};

	this.selectNext = function(kw, ulist) {
		var list = [];
		var i, il;
		ulist = ulist || table;
		for (i = 0, il = ulist.length - 1; i < il; i++) {
			if (kw === ulist[i].keyword) {
				list.push(ulist[i + 1]);
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
			kw = next[i].keyword;
			if (!lookup[kw]) {
				kwords.push(kw);
				lookup[kw] = true;
				j++;
			}
		}

		return kwords;
	};

	this.respond = function(stmt) {
		var counter = [];
		var uselist = [];
		var i, il, j, jl, count, stid;
		statement = jQuery.trim(stmt).split(" ");
		for (i = 0, il = table.length; i < il; i++) {
			if (stid !== table[i].statement) {
				if (count) {
					counter.push({
						statement: stid,
						count: count
					});
				}
				stid = table[i].statement;
				count = 0;
			}

			for (j = 0, jl = statement.length - 1; j < jl; j++) {
				if (statement[j] === table[i].keyword) {		
					count++;
				}
			}
		}

		counter.sort(count_sort);
		il = counter.length;
		cutoff = Math.round((counter[il - 1].count - counter[0].count) / 2);
		for (i = 0; i < il; i++) {
			if (counter[i].count > cutoff) {
				stid = counter[i].statement + 1;
				if (stid > table[table.length - 1].statement)
					stid = 0;
				for (j = 0, jl = table.length; j < jl; j++) {
					if (table[j].statement === stid) {
						uselist.push(table[j]);
					}
				}
			}
		}
		
		return this.generateStatement(uselist);

	};

	this.generateStatement = function(ulist) {
	
		var token = TERMINATOR;
		var stmt = "";
		var group, target;
		
		ulist = ulist || table;

		do {
			group = this.selectNext(token);
			target = Math.floor(prng.get() * group.length);
			token = group[target].keyword;
			stmt = stmt + token + " ";
		} while (token !== TERMINATOR);
		
		return stmt;
	};

};

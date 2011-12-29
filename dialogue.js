/**

	Dialogue Object
	Maintains the dialogue components.
	
	dialogue data format:
	
	NPC name | applicable NPC state | request | new vocabulary, if any | new state, if any | response
	
**/

PAVO.dialogue = new function() {

	var self = this;
	var root = {};

	var vocabulary = PAVO.game.player.vocabulary.split(" ");
	
	this.init = function(id) {
		var record = jQuery(id).html().split("|");
		var i, il, j, jl, data, type, ptr, temp, word;

		for (i = 0, il = record.length, type = 0; i < il; i++) {
			data = jQuery.trim(record[i]);
			switch(type) {
			
			case 0:	// NPC name
			
				ptr = root[data] = root[data] || {};
				break;

			case 1: // NPC state

				ptr = ptr[data] = ptr[data] || {};
				break;

			case 2:	// request
			
				temp = data.split(" ");
				for (j = 0, jl = temp.length; j < jl; j++) {
					word = temp[j];
					ptr.wordlist = ptr.wordlist || [];
					if (word !== "")
						ptr.wordlist.add(word);
					ptr = ptr[word] = ptr[word] || {};
				}
				break;
	
			case 3:	// new vocabulary list

				ptr.newwords = data.split(" ");			
				break;

			case 4: // new state
			
				ptr.newstate = data;
				break;

			case 5: // response
			
				ptr.response = data;
				break;
			}
			type = (type < 5) ? type + 1 : 0;
		}
	};
	
	this.follow = function(subject, request) {
		var i, il, ptr;
		ptr = root[subject.name][subject.state];
		if (request) {
			for (i = 0, il = request.length; i < il; i++) {
				ptr = ptr[request[i]];
			}
		}
		return ptr;
	};
	
	this.enumerate = function(subject, request) {
		var record = this.follow(subject, request);
		var i, il, word, list;
		if (record.wordlist) {
			list = [];
			for (i = 0, il = record.wordlist.length; i < il; i++) {
				word = record.wordlist[i];
				if (vocabulary.contains(word)) {
					list.push(word);
				}
			}
			return list;
		} else {
			return false;
		}
	};
	
	this.respond = function(subject, request) {
		var record = this.follow(subject, request);
		var i, il;
		for (i = 0, il = record.newwords.length; i < il; i++) {
			vocabulary.add(record.newwords[i]);
		}
		subject.state = record.newstate;
		return record.response;
	};

};


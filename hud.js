/**

	HUD Object

**/

PAVO.hud = new function() {

	var MESSAGE_FADE_TIME = 250;
	var MESSAGE_DELAY = 2500;

	var KW_LIST_SIZE = 8;

	var NOTHING  = 0;
	var MAY_TALK = 1;
	var TALKING  = 2;
	var MAY_USE  = 3;
	var USING    = 4;

	var self = this;
	var dom;

	this.init = function() {

		dom = {
			curtain: jQuery("#curtain"),
			debug: jQuery("#debug"),
			messages: jQuery("#messages"),
			prompt: jQuery("#prompt"),
			talk: jQuery("#talk"),
			keywordFrame: jQuery("#talk-keyword-frame"),
			dialogueFrame: jQuery("#talk-dialogue-frame"),
			dialogueWrapper: jQuery("#talk-dialogue-wrapper"),
			flip: jQuery("#flip"),
			flipBoard: jQuery("#flip-board")
		};

		dom.prompt.resize = function() {
			dom.prompt.offset( { 
				top: 4 * (FOAM.height - dom.prompt.height()) / 5,
				left: (FOAM.width - dom.prompt.width()) / 2
			});
		}
		dom.prompt.state = NOTHING;

		dom.talk.resize = function() {
			dom.talk.offset({
				top: 3 * (FOAM.height - dom.talk.height()) / 4,
				left: (FOAM.width - dom.talk.width()) / 2
			});
		};
		
		dom.flip.resize = function() {
			dom.flip.offset({
				top: 3 * (FOAM.height - dom.flip.height()) / 4,
				left: (FOAM.width - dom.flip.width()) / 2
			});
		}
		
		jQuery(window).bind("resize", function() { 
			self.resize();
		});
		jQuery(window).bind("keydown", this.onKeyDown);
		
		// disable mouse selection behaviors
		dom.talk.bind("mousedown", function() {
			return false;
		} );
		dom.curtain.bind("mousedown", function() {
			return false;
		} );

		this.resize();
	};
	
	this.start = function() {
		dom.curtain.css("background-color", "rgba(0, 0, 0, 0.75)");
		dom.curtain.css("display", "none");
	};

	this.resize = function() {
		dom.curtain.width(FOAM.width);
		dom.curtain.height(FOAM.height);
		dom.prompt.resize();
		dom.messages.css("bottom", (4 * FOAM.height / 5) + "px");
		dom.talk.resize();
		dom.flip.resize();
	};

	this.setDebug = function(s) {
		if (dom.debug.css("display") === "none") {
			dom.debug.css("display", "block");
		}
		dom.debug.html(s);
	};

	this.update = function() {
	};

	this.onKeyDown = function(event) {
		switch(event.keyCode) {
		case FOAM.KEY.ESCAPE:
			if (FOAM.running && dom.talk.visible) {
				self.hideDialogue();
				// a bit of a hack: setting this flag
				// to null requires the ghosts object
				// to reset it thus throwing an event
				// over to the HUD object, which then
				// redisplays the talk prompt
				PAVO.ghosts.listening = null;
				PAVO.player.invalidateMouse();
			} else if(FOAM.running && dom.flip.visible) {
				self.hidePuzzle();
				// a bit of a hack: see above
				PAVO.panels.listening = null;
				PAVO.player.invalidateMouse();
			} else {
				self.togglePause();
			}
			break;
		case FOAM.KEY.E:
			if (FOAM.running && dom.prompt.state === MAY_TALK) {
				dom.prompt.state = TALKING;
				self.setPrompt();
				self.showDialogue();
			}
			if (FOAM.running && dom.prompt.state === MAY_USE) {
				dom.prompt.state = USING;
				self.setPrompt();
				self.showPuzzle();
			}
			break;
		case FOAM.KEY.TAB:
			// prevent tab focus change
			return false;
			break;
		default:
			//console.log(event.keyCode);
			break;
		}
	};

	this.togglePause = function() {
		if (FOAM.running) {
			FOAM.running = false;
			dom.curtain.css("display", "block");
			dom.curtain.width(FOAM.width);
			dom.curtain.height(FOAM.height);
			PAVO.player.invalidateMouse();
		}
		else {
			FOAM.running = true;
			dom.curtain.css("display", "none");
		}
	};
	
	this.addMessage = function(msg) {
		var div = jQuery(document.createElement("div"));
		div.html(msg);
		div.css("display", "none");
		dom.messages.append(div);
		div.fadeIn(MESSAGE_FADE_TIME)
			.delay(MESSAGE_DELAY)
			.fadeOut(MESSAGE_FADE_TIME, function() {
				div.remove();
		});
	};
	
	this.setPrompt = function(lines) {
		var i, il, ln, div, s;
		lines = lines || [];
		dom.prompt.empty();
		for (i = 0, il = lines.length; i < il; i++) {
			ln = lines[i];
			div = jQuery(document.createElement("div"));
			s = (ln.key) ? "<span class=\"key\">" + ln.key + "</span> " : "";
			s = s + ln.msg;
			div.html(s);
			dom.prompt.append(div);
		}
		dom.prompt.resize();
	};
	
	this.promptToTalk = function(ghost) {
		if (ghost) {
			this.setPrompt( [
				{ key: "E", msg: "talk" },
				{ msg: "ghost" }
			] );
			dom.prompt.state = MAY_TALK;
		} else {
			this.setPrompt();
			dom.prompt.state = NOTHING;
		}
		dom.prompt.subject = ghost;
	};

	this.promptToUse = function(panel) {
		if (panel) {
			this.setPrompt( [
				{ key: "E", msg: "use" },
				{ msg: "panel" }
			] );
			dom.prompt.state = MAY_USE;
		} else {
			this.setPrompt();
			dom.prompt.state = NOTHING;
		}
		dom.prompt.subject = panel;
	};

	this.showDialogue = function() {
		PAVO.player.freeze = true;
		this.listKeywords();
		dom.dialogueFrame.empty();
		delete dom.statement;
		dom.talk.css("display", "block");
		dom.talk.resize();
		dom.talk.visible = true;
	};
	
	this.listKeywords = function(head) {
		var list = PAVO.dialogue.listKeywords(KW_LIST_SIZE, head);
		var i, il, div, kw;
		dom.keywordFrame.empty();
		for (i = 0, il = list.length; i < il; i++) {
			div = jQuery(document.createElement("div"));
			kw = list[i];
			div.html(kw);
			div.addClass("talk-keyword");
			div.bind("mousedown", function() {
				self.onKeywordSelect(this.innerHTML);
				dom.dialogueWrapper.scrollTop(dom.dialogueWrapper[0].scrollHeight);
			} );
			dom.keywordFrame.append(div);
		}
	};

	this.hideDialogue = function() {
		PAVO.player.freeze = false;
		dom.talk.css("display", "none");
		dom.talk.visible = false;
	}

	this.onKeywordSelect = function(kw) {
		var temp;
		if (!dom.statement) {
			dom.statement = jQuery(document.createElement("div"));
			dom.statement.addClass("talk-statement talk-player");
			dom.dialogueFrame.append(dom.statement);
		}
		dom.statement.html(dom.statement.html() + " " + kw);
		
		if (kw === ".") {
			temp = jQuery(document.createElement("div"));
			temp.addClass("talk-statement talk-ghost");
			dom.dialogueFrame.append(temp);
			temp.html(PAVO.dialogue.generateStatement());
			delete dom.statement;
		}
		
		self.listKeywords(kw);
	};
	
	this.showPuzzle = function() {
		var panel = dom.prompt.subject;
		PAVO.player.freeze = true;
		this.makeBoard(panel);
		dom.flip.css("display", "block");
		dom.flip.resize();
		dom.flip.visible = true;
	};

	this.hidePuzzle = function() {
		PAVO.player.freeze = false;
		dom.flip.css("display", "none");
		dom.flip.visible = false;
	};
	
	this.makeBoard = function(panel) {
		var size = PAVO.game.board.size;
		var row, col, pos, tr, td;
		dom.flipBoard.empty();
		for (row = 0; row < size; row++) {
			tr = jQuery(document.createElement("tr"));
			for (col = 0; col < size; col++) {
				pos = row * size + col;
				td = jQuery(document.createElement("td"));
				td.css("background-color", panel.board[pos] ? "white" : "black");
				td[0].pos = pos;
				td.bind("click", function() {
					var c = !panel.board[this.pos];
					jQuery(this).css("background-color", c ? "white" : "black");
					panel.board[this.pos] = c;
				} );
				tr.append(td);
			}
			dom.flipBoard.append(tr);
		}
	};

};

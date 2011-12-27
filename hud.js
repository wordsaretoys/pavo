/**

	HUD Object

**/

PAVO.hud = new function() {

	var MESSAGE_FADE_TIME = 250;
	var MESSAGE_DELAY = 2500;

	var KW_LIST_SIZE = 12;

	var NOTHING  = 0;
	var MAY_TALK = 1;
	var TALKING  = 2;
	var MAY_USE  = 3;
	var USING    = 4;

	var prompting = {
		state: NOTHING,
		subject: null
	};

	var selecting = {
		key: [],
		div: null
	};

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
			dialogueWrapper: jQuery("#talk-dialogue-wrapper")
		};

		dom.prompt.resize = function() {
			dom.prompt.offset( { 
				top: 4 * (FOAM.height - dom.prompt.height()) / 5,
				left: (FOAM.width - dom.prompt.width()) / 2
			});
		}

		dom.talk.resize = function() {
			dom.talk.offset({
				top: 3 * (FOAM.height - dom.talk.height()) / 4,
				left: (FOAM.width - dom.talk.width()) / 2
			});
		};
		
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
			} else {
				self.togglePause();
			}
			break;
		case FOAM.KEY.E:
			if (FOAM.running && prompting.state === MAY_TALK) {
				prompting.state = TALKING;
				self.setPrompt();
				self.showDialogue();
			}
			if (FOAM.running && prompting.state === MAY_USE) {
				prompting.state = USING;
				self.setPrompt();
				self.showDialogue();
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
				{ msg: ghost.name }
			] );
			prompting.state = MAY_TALK;
		} else {
			this.setPrompt();
			prompting.state = NOTHING;
		}
		prompting.subject = ghost;
	};

	this.promptToUse = function(panel) {
		if (panel) {
			this.setPrompt( [
				{ key: "E", msg: "use" },
				{ msg: panel.name }
			] );
			prompting.state = MAY_USE;
		} else {
			this.setPrompt();
			prompting.state = NOTHING;
		}
		prompting.subject = panel;
	};

	this.showDialogue = function() {
		var div = jQuery(document.createElement("div"));
		div.addClass("talk-name");
		div.html(prompting.subject.name);
		dom.dialogueFrame.append(div);

		PAVO.player.freeze = true;

		dom.talk.css("display", "block");
		dom.talk.resize();
		dom.talk.visible = true;

		this.addResponse(PAVO.dialogue.greet(prompting.subject.name));
		this.listWords();
	};
	
	this.wordClicked = function() {
		var stmt, word;
		
		if (!this.clicked) {
			word = this.innerHTML;
			if (!selecting.key[0]) {
				selecting.key[0] = word;
				selecting.div.html(word);
				this.clicked = true;
				dom.dialogueWrapper.scrollTop(dom.dialogueWrapper[0].scrollHeight);
			} else {
				selecting.key[1] = word;
				selecting.div.html(selecting.div.html() + " " + word);
				stmt = PAVO.dialogue.respond(prompting.subject.name, selecting.key);
				self.addResponse(stmt);
				self.listWords();
			}
		}
		
	};
	
	this.listWords = function() {
		var list = PAVO.dialogue.getWords(KW_LIST_SIZE);
		var llen = list.length;
		var i, div;
		
		dom.keywordFrame.empty();
		for (i = 0; i < llen; i++) {
			if (PAVO.dialogue.check(prompting.subject.name, list[i])) {
				div = jQuery(document.createElement("div"));
				div.html(list[i]);
				div.addClass("talk-keyword");
				dom.keywordFrame.append(div);
				div.bind("mousedown", this.wordClicked);
			}
		}
	};
	
	this.addResponse = function(text) {
	
		var div = jQuery(document.createElement("div"));
		div.addClass("talk-response");
		div.html(text);
		dom.dialogueFrame.append(div);
		dom.dialogueWrapper.scrollTop(dom.dialogueWrapper[0].scrollHeight);

		selecting.div = jQuery(document.createElement("div"));
		selecting.div.addClass("talk-player");
		dom.dialogueFrame.append(selecting.div);
		selecting.key = [];
		
	};

	this.hideDialogue = function() {
	
		// wipe out any half-finished query
		if (selecting.key[0] && !selecting.key[1]) {
			selecting.div.html("");
		}
	
		PAVO.player.freeze = false;
		dom.talk.css("display", "none");
		dom.talk.visible = false;
	};

};

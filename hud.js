/**

	HUD Object

**/

PAVO.hud = new function() {

	var MESSAGE_FADE_TIME = 500;
	var MESSAGE_DELAY = 5000;

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

	var self = this;
	var dom;

	this.init = function() {

		dom = {
			window: jQuery(window),
			curtain: jQuery("#curtain"),
			debug: jQuery("#debug"),
			messages: jQuery("#messages"),
			prompt: jQuery("#prompt"),
			talk: jQuery("#talk"),
			npcFrame: jQuery("#talk-npc-frame"),
			keywordFrame: jQuery("#talk-keyword-frame"),
			responseFrame: jQuery("#talk-response-frame"),
			theend: jQuery("#the-end")
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
		
		dom.theend.resize = function() {
			dom.theend.offset({
				top: (FOAM.height - dom.theend.height()) / 2,
				left: (FOAM.width - dom.theend.width()) / 2
			});
		};

		// insure that window redraws when paused and resized
		dom.window.bind("resize", function() { 
			self.resize();
			PAVO.world.draw();
		});

		dom.window.bind("keydown", this.onKeyDown);
		
		// disable mouse selection behaviors
		dom.talk.bind("mousedown", function() {
			return false;
		} );
		dom.curtain.bind("mousedown", function() {
			return false;
		} );
		dom.theend.bind("mousedown", function() {
			return false;
		} );

		this.resize();
		
		this.addMessage("Click and drag the mouse to look around.");
		this.addMessage("Use the W S A D keys to move. Hold down SHIFT to sprint.");
		this.addMessage("Press E when prompted to interact.");
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
		var response, wordlist;

		PAVO.player.freeze = true;

		dom.talk.css("display", "block");
		dom.talk.resize();
		dom.talk.visible = true;

		dom.npcFrame.html(prompting.subject.name);

		response = PAVO.dialogue.getResponse(prompting.subject);
		dom.responseFrame.html(response);
		wordlist = PAVO.dialogue.getKeywords(prompting.subject);
		this.showKeywords(wordlist);
	};
	
	this.wordClicked = function() {
		var request, response, wordlist;
		request = this.innerHTML;
		response = PAVO.dialogue.getResponse(prompting.subject, request);
		dom.responseFrame.html(response);
		wordlist = PAVO.dialogue.getKeywords(prompting.subject);
		self.showKeywords(wordlist);
	};
	
	this.showKeywords = function(list) {
		var llen = Math.min(list.length, KW_LIST_SIZE);
		var i, div;
		
		dom.keywordFrame.empty();
		dom.keywordFrame.css("display", llen ? "block" : "none");
		
		for (i = 0; i < llen; i++) {
			div = jQuery(document.createElement("div"));
			div.html(list[i]);
			div.addClass("talk-keyword");
			dom.keywordFrame.append(div);
			div.bind("mousedown", this.wordClicked);
		}
	};
	
	this.hideDialogue = function() {
		PAVO.player.freeze = false;
		dom.talk.css("display", "none");
		dom.talk.visible = false;
	};

	this.end = function() {
		dom.curtain.css("display", "block");
		dom.curtain.width(FOAM.width);
		dom.curtain.height(FOAM.height);
		dom.curtain.css("background-color", "white");
		dom.curtain.css("opacity", "0");
		dom.curtain.animate( { opacity: 1 }, 2500, function() {
			FOAM.running = false;
			PAVO.hud.togglePause = function() {};
			dom.theend.css("display", "block");
			dom.theend.resize();
		});
	};
};

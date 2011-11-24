/**

	HUD Object

**/

PAVO.hud = new function() {

	var PROMPT_FADE_TIME = 250;
	var MESSAGE_FADE_TIME = 250;
	var MESSAGE_DELAY = 2500;

	var NOTHING  = 0;
	var MAY_TALK = 1;
	var TALKING  = 2;

	var self = this;
	var dom;
	
	this.init = function() {

		dom = {
			curtain: jQuery("#curtain"),
			debug: jQuery("#debug"),
			messages: jQuery("#messages"),
			prompt: jQuery("#prompt")
		};

		dom.prompt.resize = function() {
			dom.prompt.offset( { 
				top: 4 * (FOAM.height - dom.prompt.height()) / 5,
				left: (FOAM.width - dom.prompt.width()) / 2
			});
		}
		dom.prompt.state = NOTHING;
		
		this.resize();
		
		var instance = this;
		jQuery(window).bind("resize", function(){ instance.resize() });
		jQuery(window).bind("keydown", instance.onKeyDown);
	};
	
	this.resize = function() {
		dom.curtain.width(FOAM.width);
		dom.curtain.height(FOAM.height);
		dom.prompt.resize();
		dom.messages.css("bottom", (4 * FOAM.height / 5) + "px");
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
			if (dom.prompt.state === TALKING) {
				PAVO.player.freeze = false;
				self.promptToTalk(dom.prompt.subject);
			} else {
				self.togglePause();
			}
			break;
		case FOAM.KEY.E:
			if (dom.prompt.state === MAY_TALK) {
				dom.prompt.state = TALKING;
				PAVO.player.freeze = true;
				self.talk();
			}
			break;
		default:
			//window.alert(event.keyCode);
			break;
		}
	};

	this.togglePause = function() {
		if (FOAM.running) {
			FOAM.running = false;
			dom.curtain.css("background-color", "rgba(0, 0, 0, 0.75)");
			dom.curtain.width(FOAM.width);
			dom.curtain.height(FOAM.height);
		}
		else {
			FOAM.running = true;
			dom.curtain.css("background-color", "transparent");
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
				{ msg: ghost.name || "anonymous" }
			] );
			dom.prompt.state = MAY_TALK;
		} else {
			this.setPrompt();
			dom.prompt.state = NOTHING;
		}
		dom.prompt.subject = ghost;
	};

	this.talk = function(response) {
		self.setPrompt( [
			{ msg: dom.prompt.subject.name + ": boo i am a ghost" },
			{ msg: "&nbsp;" },
			{ key: "1", msg: "ghost is bullshit" },
			{ key: "2", msg: "where am i?" },
			{ key: "3", msg: "these are ugly colors" },
			{ key: "Esc", msg: "never mind" }
		] );
	
	};	
	
};

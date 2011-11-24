/**

	HUD Object

**/

PAVO.hud = new function() {

	var PROMPT_FADE_TIME = 250;
	var MESSAGE_FADE_TIME = 250;
	var MESSAGE_DELAY = 2500;

	var self = this;
	var dom;
	
	var prompted = false;
	
	this.init = function() {

		dom = {
			curtain: jQuery("#curtain"),
			debug: jQuery("#debug"),
			messages: jQuery("#messages"),
			prompt: jQuery("#prompt")
		};

		dom.prompt.resize = function() {
			dom.prompt.offset( { 
				top: 3 * (FOAM.height - dom.prompt.height()) / 4,
				left: (FOAM.width - dom.prompt.width()) / 2
			});
		}
		
		this.resize();
		
		var instance = this;
		jQuery(window).bind("resize", function(){ instance.resize() });
		jQuery(window).bind("keydown", instance.onKeyDown);
		
		dom.debug.css("display", "block");
//		FOAM.schedule(this.showDebug, 25, true);
	};
	
	this.resize = function() {
		dom.curtain.width(FOAM.width);
		dom.curtain.height(FOAM.height);

		dom.prompt.resize();

		dom.messages.offset( { 
			top: FOAM.height / 4
		});
	};

	function chop(n, d) {
		var p10 = Math.pow(10, d);
		return Math.round(n * p10) / p10;
	}

	this.showDebug = function() {
		var s = ""
		dom.debug.html(s);
	};
	
	this.setDebug = function(s) {
		dom.debug.html(s);
	};

	this.update = function() {
	
		if (PAVO.ghosts.listening) {
			if (!prompted) {
				this.addPrompt("e", "talk");
				this.addPrompt(undefined, PAVO.ghosts.listening.name || "anonymous");
				dom.prompt.resize();
				prompted = true;
			}
		} else {
			if (prompted) {
				this.clearPrompts();
				prompted = false;
			}
		}
	
	};

	this.onKeyDown = function(event) {
		switch(event.keyCode) {
			case FOAM.KEY.ESCAPE:
				if (false) {
					dom.talkBox.fadeOut(PROMPT_FADE_TIME);
					dom.talkBox.displayed = false;
					PAVO.player.freeze = false;
				} else {
					self.togglePause();
				}
				break;
			case FOAM.KEY.E:
			/*
				if (dom.talkPrompt.displayed && !dom.talkBox.displayed) {
					dom.talkBox.fadeIn(PROMPT_FADE_TIME);
					dom.talkBox.resize();
					dom.talkBox.displayed = true;
					PAVO.player.freeze = true;
				}
			*/
				break;
			case FOAM.KEY.L:
				PAVO.hud.addMessage("" + new Date().getTime());
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
	
	this.wait = function() {
	};
	
	this.unwait = function() {
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
	
	this.addPrompt = function(key, msg) {
		var div = jQuery(document.createElement("div"));
		if (key) {
			msg = "<span class=\"key\">" + key + "</span> " + msg;
		}
		div.html(msg);
		div.css("display", "none");
		dom.prompt.append(div);
		div.fadeIn(PROMPT_FADE_TIME)
	};
	
	this.clearPrompts = function() {
		jQuery("#prompt > *").fadeOut(PROMPT_FADE_TIME, function() {
			dom.prompt.empty();
		});
	};
	
};

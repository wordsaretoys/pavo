/**

	HUD Object

**/

PAVO.hud = new function() {

	var PROMPT_FADE_TIME = 250;

	var self = this;
	var dom;
	
	this.init = function() {

		dom = {
			curtain: jQuery("#curtain"),
			debug: jQuery("#debug"),
			
			talkPrompt: jQuery("#talk-prompt"),
			talkPromptName: jQuery("#talk-prompt-name"),
			
			talkBox: jQuery("#talk-box"),
			talkBoxReply: jQuery("#talk-box-reply"),
			talkBoxQ1: jQuery("talk-box-q1"),
			talkBoxQ2: jQuery("talk-box-q2"),
			talkBoxQ3: jQuery("talk-box-q3")
		};

		dom.talkPrompt.resize = function() {
			dom.talkPrompt.offset( { 
				top: 3 * (FOAM.height - dom.talkPrompt.height()) / 4,
				left: (FOAM.width - dom.talkPrompt.width()) / 2
			});
		}
		
		dom.talkBox.resize = function() {
			dom.talkBox.offset( { 
				top: 3 * (FOAM.height - dom.talkBox.height()) / 4,
				left: (FOAM.width - dom.talkBox.width()) / 2
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

		dom.talkPrompt.resize();
		dom.talkBox.resize();
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
			if (!dom.talkPrompt.displayed) {
				dom.talkPrompt.fadeIn(PROMPT_FADE_TIME);
				dom.talkPrompt.resize();
				dom.talkPromptName.html(PAVO.ghosts.listening.name || "anonymous");
				dom.talkPrompt.displayed = true;
			}
		} else {
			if (dom.talkPrompt.displayed) {
				dom.talkPrompt.fadeOut(PROMPT_FADE_TIME);
				dom.talkPrompt.displayed = false;
			}
		}
	
	};

	this.onKeyDown = function(event) {
		switch(event.keyCode) {
			case FOAM.KEY.ESCAPE:
				if (dom.talkBox.displayed) {
					dom.talkBox.fadeOut(PROMPT_FADE_TIME);
					dom.talkBox.displayed = false;
					PAVO.player.freeze = false;
				} else {
					self.togglePause();
				}
				break;
			case FOAM.KEY.E:
				if (dom.talkPrompt.displayed && !dom.talkBox.displayed) {
					dom.talkBox.fadeIn(PROMPT_FADE_TIME);
					dom.talkBox.resize();
					dom.talkBox.displayed = true;
					PAVO.player.freeze = true;
				}
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
		dom.curtain.css("cursor", "wait");
	};
	
	this.unwait = function() {
		dom.curtain.css("cursor", "move");
	};
};

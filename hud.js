/**

	HUD Object

**/

PAVO.hud = new function() {

	var self = this;
	var dom;
	
	this.init = function() {

		dom = {
			curtain: jQuery("#curtain"),
			debug: jQuery("#debug"),
			talkPrompt: jQuery("#talk-prompt"),
			talkPromptName: jQuery("#talk-prompt-name")
		};
		
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
				dom.talkPrompt.css("display", "block");
				dom.talkPrompt.offset( { 
					top: 3 * (FOAM.height - dom.talkPrompt.height()) / 4,
					left: (FOAM.width - dom.talkPrompt.width()) / 2
				});
				dom.talkPromptName.html(PAVO.ghosts.listening.name || "anonymous");
				dom.talkPrompt.displayed = true;
			}
		} else {
			if (dom.talkPrompt.displayed) {
				dom.talkPrompt.css("display", "none");
				dom.talkPrompt.displayed = false;
			}
		}
	
	};

	this.onKeyDown = function(event) {
		switch(event.keyCode) {
			case FOAM.KEY.ESCAPE:
				self.togglePause();
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
	
	this.wait = function() {
		dom.curtain.css("cursor", "wait");
	};
	
	this.unwait = function() {
		dom.curtain.css("cursor", "move");
	};
};

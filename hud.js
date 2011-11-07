/**

	HUD Object

**/

PAVO.hud = new function() {

	var self = this;
	var dom;
	
	this.init = function() {

		dom = {
			curtain: jQuery("#curtain"),
			debug: jQuery("#debug")
		};
		
		this.resize();
		
		var instance = this;
		jQuery(window).bind("resize", function(){ instance.resize() });
		jQuery(window).bind("keydown", instance.onKeyDown);
		
		dom.debug.css("display", "block");
//		FOAM.schedule(this.showDebug, 25, true);
	};
	
	this.resize = function() {
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
			dom.curtain.css("display", "block");
			dom.curtain.width(FOAM.width);
			dom.curtain.height(FOAM.height);
		}
		else {
			FOAM.running = true;
			dom.curtain.css("display", "none");
		}
	};
	
	this.wait = function() {
		dom.curtain.css("cursor", "wait");
	};
	
	this.unwait = function() {
		dom.curtain.css("cursor", "move");
	};
};

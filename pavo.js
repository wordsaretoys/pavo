/**

	Pavo Main Object

	requires Foam library

	TODO: how to deal with gl context loss/restore?

**/

var PAVO = new function() {
	
	var self = this;
	
	this.init = function() {
	
		// initialize the Foam API
		if (!FOAM.init("gl", true)) {
			jQuery("#glerror").show();
			return;
		}
		gl = FOAM.gl;

		Math.clamp = function(x, lo, hi) {
			return Math.min(Math.max(x, lo), hi);
		}

		// set up any webgl stuff that's not likely to change
		gl.clearDepth(1.0);
		gl.depthFunc(gl.LEQUAL);
		gl.enable(gl.DEPTH_TEST);
		
		self.hud.init();
		
		FOAM.resources.addImage("walls", "res/walls.png");
		FOAM.resources.addImage("ghost", "res/ghost.png");
		FOAM.resources.addImage("debris", "res/debris.png");
		
		FOAM.resources.onComplete = function() {
		
			FOAM.shaders.build(
				"block", "vs-block", "fs-block",
				["position", "texturec", "a_color", "a_light", "a_panel"],
				["projector", "modelview"],
				["palette", "panels"] );

			FOAM.shaders.build(
				"ghost", "vs-ghost", "fs-ghost",
				["position", "texturec"],
				["projector", "modelview", "center", "rotations", "alpha"],
				["panels"] );

			FOAM.shaders.build(
				"debris", "vs-debris", "fs-debris",
				["position", "texturec"],
				["projector", "modelview", "center", "alpha"],
				["panels"] );

			FOAM.textures.build("walls");
			FOAM.textures.build("ghost");
			FOAM.textures.build("debris");

			self.world.init();

			FOAM.schedule(self.world.update, 0, true);
			FOAM.schedule(self.world.draw, 0, true);

			// insure that window redraws when paused and resized			
			jQuery(window).bind("resize", function(){
				PAVO.hud.resize();
				self.world.draw();
			});
		
		};
		
		FOAM.resources.load();
	};
	
};


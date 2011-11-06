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

		// set up any webgl stuff that's not likely to change
		gl.clearDepth(1.0);
		gl.depthFunc(gl.LEQUAL);
		gl.enable(gl.DEPTH_TEST);
		
		self.hud.init();
		self.hud.wait();
		
		FOAM.resources.addImage("walls", "res/walls.png");
		FOAM.resources.addImage("bots", "res/bots.png");
		
		FOAM.resources.onComplete = function() {
		
			FOAM.shaders.build(
				"block", "vs-block", "fs-block",
				["position", "texturec", "a_color", "a_light", "a_panel"],
				["projector", "modelview"],
				["palette", "panels"] );

			FOAM.shaders.build(
				"bot", "vs-bot", "fs-bot",
				["position", "texturec"],
				["projector", "modelview", "color", "light", "center", "rotations"],
				["palette", "panels"] );

			FOAM.textures.build("walls");
			FOAM.textures.build("bots");

			self.world.init();

			FOAM.schedule(self.world.update, 0, true);
			FOAM.schedule(self.world.draw, 0, true);

			// insure that window redraws when paused and resized			
			jQuery(window).bind("resize", function(){ self.world.draw() });
		
			self.hud.unwait();
		};
		
		FOAM.resources.load();
	};
	
};


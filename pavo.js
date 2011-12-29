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

		// add useful methods to built-in objects
		Math.clamp = function(x, lo, hi) {
			return Math.min(Math.max(x, lo), hi);
		}
		
		Array.prototype.contains = function(e) {
			var i, il;
			for (i = 0, il = this.length; i < il; i++) {
				if (this[i] === e) {
					return true;
				}
			}
			return false;
		};

		Array.prototype.add = function(e) {
			if (!this.contains(e))
				this.push(e);
		};
		
		Array.prototype.match = function(a) {
			var i, il, list = [];
			for (i = 0, il = a.length; i < il; i++) {
				if (this.contains(a[i])) {
					list.add(a[i]);
				}
			}
			return list;
		};

		Array.prototype.del = function(e) {
			var i;
			for (i = this.length - 1; i >= 0; i--) {
				if (this[i] === e) {
					this.splice(i, 1);
					return;
				}
			}
		};
		
		// set up any webgl stuff that's not likely to change
		gl.clearDepth(1.0);
		gl.depthFunc(gl.LEQUAL);
		gl.enable(gl.DEPTH_TEST);
		
		self.hud.init();
		
		FOAM.resources.addImage("walls", "res/walls.png");
		FOAM.resources.addImage("ghost", "res/ghost.png");
		FOAM.resources.addImage("panel", "res/panel.png");
		
		FOAM.resources.onComplete = function() {
		
			FOAM.shaders.build(
				"block", "vs-block", "fs-block",
				["position", "texturec", "a_color", "a_light", "a_image"],
				["projector", "modelview"],
				["palette", "images"] );

			FOAM.shaders.build(
				"ghost", "vs-ghost", "fs-ghost",
				["position", "texturec"],
				["projector", "modelview", "center", "rotations", "alpha"],
				["images"] );

			FOAM.shaders.build(
				"panel", "vs-panel", "fs-panel",
				["position", "texturec"],
				["projector", "modelview", "center", "rotations", "alpha", "phase"],
				["images"] );

			FOAM.textures.build("walls");
			FOAM.textures.build("ghost");
			FOAM.textures.build("panel");

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


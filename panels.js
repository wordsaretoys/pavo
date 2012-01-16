/**
	maintain collection of panel objects
	
	@namespace PAVO
	@class panels
**/

PAVO.panels = new function() {

	var VIEW_RADIUS = 100;
	var FADE_RADIUS = 5;
	var TALK_RADIUS = 5;

	var self = this;
	var list = [];
	var mesh;

	var scratch = {
		pos: new FOAM.Vector()
	};

	this.listening = null;
	
	/**
		generate collection of panel objects
		and standard panel vertex mesh
		
		@method init
	**/

	this.init = function() {
		var cs = PAVO.game.panels;
		var i, il, c;
		mesh = PAVO.models.createPanelMesh();
		for (i = 0, il = cs.length; i < il; i++) {
			c = new FOAM.Thing();
			c.position.copy(cs[i].position);
			c.position.y += 1;
			c.turn(0, cs[i].rotation * Math.PI, 0);
			c.name = cs[i].name;
			list.push(c);
		}
	};
	
	/**
		draw the collection of panels
		
		@method draw
	**/

	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player;
		var program = FOAM.shaders.activate("panel");
		var i, il, c, a, d, t, p;
		var lt = null;
		
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		
		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		FOAM.textures.bind(0, program.images, "panel");
		p = Math.floor(FOAM.elapsedTime * 0.001) % 5;
		gl.uniform1f(program.phase, p);
		for (i = 0, il = list.length; i < il; i++) {
			c = list[i];
			d = c.position.distance(cam.position);
			
			// we only draw panels close enough to see
			if (d <= VIEW_RADIUS) {
			
				// if the player is close enough to a panel to use it
				// make a note of which panel the player is looking at
				if (d <= TALK_RADIUS) {
					scratch.pos.copy(cam.position).sub(c.position).norm();
					t = TALK_RADIUS * scratch.pos.dot(cam.orientation.front) / d;
					if (t > 1) {
						lt = c;
					}
				}
			
				a = Math.clamp((VIEW_RADIUS - d) / FADE_RADIUS, 0, 1);
				gl.uniform3f(program.center, c.position.x, c.position.y, c.position.z);
				gl.uniform1f(program.alpha, a);
				gl.uniformMatrix4fv(program.rotations, false, c.matrix.transpose);
				mesh.draw();
			}
		}

		gl.disable(gl.BLEND);

		// let the HUD know if the player is looking at a nearby panel
		if (lt !== this.listening) {
			PAVO.hud.promptToUse(lt);
			this.listening = lt;
		}
	};
	
};


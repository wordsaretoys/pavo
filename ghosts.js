/**
	maintain collection of ghost NPCs
	
	@namespace PAVO
	@class ghosts
**/

PAVO.ghosts = new function() {

	var VIEW_RADIUS = 50;
	var FADE_RADIUS =  5;
	var TALK_RADIUS = 5;
	var SPIN_RATE = 0.05;

	var self = this;
	var list = [];
	var prng;
	var mesh;

	var scratch = {
		pos: new FOAM.Vector()
	};
	
	this.listening = null;
	
	/**
		generate collection of ghost objects
		and standard ghost vertex mesh
		
		@method init
	**/

	this.init = function() {
		var gs = PAVO.game.ghosts;
		var i, il, g;
	
		mesh = PAVO.models.createGhostMesh();
		prng = new FOAM.Prng();

		for (i = 0, il = gs.length; i < il; i++) {
			g = PAVO.makeMover();
			g.position.copy(gs[i].position);
			g.position.y += 3;
			g.timer = 0;
			g.target = new FOAM.Vector();
			g.lastPos = new FOAM.Vector();
			g.name = gs[i].name;
			g.active = true;
			list.push(g);
		}
	};
	
	/**
		update each ghost's opacity if it is fading, and remove
		from the collection any ghost that has faded completely
		
		called on each animation frame
		
		@method update
	**/

	this.update = function() {
		var i, g;
		for (i = list.length - 1; i >= 0; i--) {
			g = list[i];
			if (!g.active) {
				g.alpha = g.alpha ? g.alpha * 0.95 : 0.5;
				if (g.alpha < 0.001) {
					list.splice(i, 1);
				}
			}
		}
	};
	
	/**
		animation handler that allows a ghost to watch the player and
		generate small "lifelike" movements quasi-periodically
		
		@method trackPlayer
		@param g ghost to rotate
		@param pp vector object description player's current position
	**/

	this.trackPlayer = function(g, pp) {
		var z;
		
		// if the ghost's timer has counted down to zero
		// and the player hasn't moved since the last target set
		if (g.timer <= 0 || pp.distance(g.lastPos) > 0) {
			// set new random target somewhere around the player
			g.target.set(
				pp.x + 4 * (prng.get() - 0.5),
				pp.y + 4 * (prng.get() - 0.5),
				pp.z + 4 * (prng.get() - 0.5)
			);
			// set new random timeout
			g.timer = 1000 + Math.floor(prng.get() * 2500);
			g.lastPos.copy(pp);
		} else {
			// count down
			g.timer -= FOAM.interval;
		}

		// rotate the ghost slowly towards existing target
		scratch.pos.copy(g.target).sub(g.position).norm();
		z = (scratch.pos.z > 0) ? 1 : -1; 
		scratch.pos.sub(g.orientation.front);
		g.spin(z * scratch.pos.x * SPIN_RATE, -scratch.pos.y * SPIN_RATE);
	};

	/**
		draw the collection of ghosts
		
		@method draw
	**/

	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player;
		var program = FOAM.shaders.activate("ghost");
		var i, il, g, a, d, t;
		var lt = null;
		
		// ghosts must be somewhat transparent
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		FOAM.textures.bind(0, program.images, "ghost");
		for (i = 0, il = list.length; i < il; i++) {
			g = list[i];
			d = g.position.distance(cam.position);
			// we only draw and animate ghosts close enough to see
			if (d <= VIEW_RADIUS) {

				this.trackPlayer(g, cam.position);

				// if the player is close enough to a ghost to talk
				// make a note of which ghost the player is looking at
				if (d <= TALK_RADIUS && g.active) {
					scratch.pos.copy(cam.position).sub(g.position).norm();
					t = TALK_RADIUS * scratch.pos.dot(cam.orientation.front) / d;
					if (t > 1) {
						lt = g;
					}
				}

				// ghost opacity changes if the ghost is 
				// (a) fading or 
				// (b) outside a given distance from the player
				if (g.alpha) {
					a = g.alpha;
				} else {			
					a = 0.5 * Math.clamp((VIEW_RADIUS - d) / FADE_RADIUS, 0, 1);
				}

				gl.uniform3f(program.center, g.position.x, g.position.y, g.position.z);
				gl.uniform1f(program.alpha, a);
				gl.uniformMatrix4fv(program.rotations, false, g.matrix.transpose);
				mesh.draw();
			}
		}

		gl.disable(gl.BLEND);

		// let the HUD know if the player is looking at a nearby ghost
		if (lt !== this.listening) {
			PAVO.hud.promptToTalk(lt);
			this.listening = lt;
		}
	};
	
};


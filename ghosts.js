/**

	Ghosts Object
	Maintains collection of ghosts.
	
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
	
	this.init = function() {
		var gs = PAVO.game.ghosts;
		var i, il, g;
	
		prng = new FOAM.Prng();
		mesh = PAVO.models.createGhostMesh();

		for (i = 0, il = gs.length; i < il; i++) {
			g = PAVO.makeMover();
			g.position.copy(gs[i].position);
			g.position.y += 3;
			g.timer = 0;
			g.target = new FOAM.Vector();
			g.lastPos = new FOAM.Vector();
			g.name = gs[i].name;
			g.state = "";
			list.push(g);
		}
	};
	
	this.update = function() {
	};
	
	this.trackPlayer = function(g, pp) {
		if (g.timer <= 0 || pp.distance(g.lastPos) > 0) {
			g.target.set(
				pp.x + 4 * (prng.get() - 0.5),
				pp.y + 4 * (prng.get() - 0.5),
				pp.z + 4 * (prng.get() - 0.5)
			);
			g.timer = 1000 + Math.floor(prng.get() * 2500);
			g.lastPos.copy(pp);
		} else {
			g.timer -= FOAM.interval;
		}

		scratch.pos.copy(g.target).sub(g.position).norm();
		z = (scratch.pos.z > 0) ? 1 : -1; 
		scratch.pos.sub(g.orientation.front);
		g.spin(z * scratch.pos.x * SPIN_RATE, -scratch.pos.y * SPIN_RATE);
	};

	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player;
		var program = FOAM.shaders.activate("ghost");
		var i, il, g, a, d, t;
		var lt = null;
		
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		FOAM.textures.bind(0, program.images, "ghost");
		for (i = 0, il = list.length; i < il; i++) {
			g = list[i];
			d = g.position.distance(cam.position);
			if (d <= VIEW_RADIUS) {
			
				this.trackPlayer(g, cam.position);

				if (d <= TALK_RADIUS) {
					scratch.pos.copy(cam.position).sub(g.position).norm();
					t = TALK_RADIUS * scratch.pos.dot(cam.orientation.front) / d;
					if (t > 1) {
						lt = g;
					}
				}
			
				a = 0.5 * Math.clamp((VIEW_RADIUS - d) / FADE_RADIUS, 0, 1);
				gl.uniform3f(program.center, g.position.x, g.position.y, g.position.z);
				gl.uniform1f(program.alpha, a);
				gl.uniformMatrix4fv(program.rotations, false, g.matrix.transpose);
				mesh.draw();
			}
		}

		gl.disable(gl.BLEND);
		
		if (lt !== this.listening) {
			PAVO.hud.promptToTalk(lt);
			this.listening = lt;
		}
	};
	
};


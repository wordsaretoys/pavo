/**

	Ghosts Object
	Maintains collection of ghosts.
	
**/

PAVO.ghosts = new function() {

	var VIEW_RADIUS = 50;
	var TALK_RADIUS = 5;
	var SPIN_RATE = 0.1;

	var self = this;
	var list = [];
	var prng;
	var mesh;

	var scratch = {
		pos: new FOAM.Vector()
	};
	
	this.listening = null;

	this.init = function() {
		var gl = PAVO.game.ghosts;
		var i, il, g;
	
		prng = new FOAM.Prng();
		mesh = PAVO.models.createBotMesh();

		for (i = 0, il = gl.length; i < il; i++) {
			g = PAVO.makeMover();
			g.position.copy(gl[i].position);
			g.name = gl[i].name;
			g.timer = 0;
			g.target = new FOAM.Vector();
			g.lastPos = new FOAM.Vector();
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
		
		this.listening = null;
		
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		FOAM.textures.bind(0, program.panels, "ghost");
		for (i = 0, il = list.length; i < il; i++) {
			g = list[i];
			d = g.position.distance(cam.position);
			if (d <= VIEW_RADIUS) {
			
				this.trackPlayer(g, cam.position);

				if (d <= TALK_RADIUS) {
					scratch.pos.copy(cam.position).sub(g.position).norm();
					t = scratch.pos.dot(cam.orientation.front);
					if (t > 0.95) {
						this.listening = g;
					}
				}
			
				a = 0.5 * (VIEW_RADIUS - d) / VIEW_RADIUS;
				gl.uniform3f(program.center, g.position.x, g.position.y, g.position.z);
				gl.uniform1f(program.alpha, a);
				gl.uniformMatrix4fv(program.rotations, false, g.matrix.transpose);
				mesh.draw();
			}
		}

		gl.disable(gl.BLEND);
	};
	
};


/**

	Ghosts Object
	Maintains collection of ghosts.
	
**/

PAVO.ghosts = new function() {

	var VIEW_RADIUS = 50;
	var SPIN_RATE = 0.1;

	var self = this;
	var list = [];
	var prng;
	var mesh;

	var temp = {
		pos: new FOAM.Vector()
	};

	this.init = function() {
		var gl = PAVO.game.ghosts;
		var i, il, g;
	
		prng = new FOAM.Prng();
		mesh = PAVO.models.createBotMesh();

		for (i = 0, il = gl.length; i < il; i++) {
			g = PAVO.makeMover();
			g.position.copy(gl[i].position);
			g.timer = 0;
			g.target = new FOAM.Vector();
			g.lastPos = new FOAM.Vector();
			list.push(g);
		}
	};
	
	this.update = function() {
		var ps = PAVO.player.position;
		var i, il, g, p, d, z;
		
		for (i = 0, il = list.length; i < il; i++) {
			g = list[i];
			p = g.position;
			d = p.distance(PAVO.player.position);
			if (d <= VIEW_RADIUS) {
				if (g.timer <= 0 || ps.distance(g.lastPos) > 0) {
					g.target.set(
						ps.x + 4 * (prng.get() - 0.5),
						ps.y + 4 * (prng.get() - 0.5),
						ps.z + 4 * (prng.get() - 0.5)
					);
					g.timer = 1000 + Math.floor(prng.get() * 2500);
					g.lastPos.copy(ps);
				} else {
					g.timer -= FOAM.interval;
				}

				temp.pos.copy(g.target).sub(g.position).norm();
				z = (temp.pos.z > 0) ? 1 : -1; 
				temp.pos.sub(g.orientation.front);
				g.spin(z * temp.pos.x * SPIN_RATE, -temp.pos.y * SPIN_RATE);
			}
		}
	};

	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player;
		var program = FOAM.shaders.activate("ghost");
		var i, il, p, g, a, d;
		
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		FOAM.textures.bind(0, program.panels, "ghost");
		for (i = 0, il = list.length; i < il; i++) {
			g = list[i];
			p = g.position;
			d = p.distance(PAVO.player.position);
			if (d <= VIEW_RADIUS) {
				a = 0.75 * (VIEW_RADIUS - d) / VIEW_RADIUS;
				gl.uniform3f(program.center, p.x, p.y, p.z);
				gl.uniform1f(program.alpha, a);
				gl.uniformMatrix4fv(program.rotations, false, g.matrix.transpose);
				mesh.draw();
			}
		}

		gl.disable(gl.BLEND);
	};
	
};


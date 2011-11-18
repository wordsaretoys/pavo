/**

	Items Object
	
	Generates and maintains items that can be picked up.
	
**/

PAVO.items = new function() {

	var prng = new FOAM.Prng(213423);
	var item = [];
	var mesh;

	this.init = function() {
		var gitem = PAVO.game.items;
		var size = PAVO.game.space.size;
		var i, il, p;

		for (i = 0, il = gitem.count; i < il; i++) {
		
			p = new FOAM.Vector();
			do {
				p.set(prng.get() * size.x, prng.get() * size.y, prng.get() * size.z);
			} while(!PAVO.space.checkFloorSpace(p));
			
			item.push( {
				position: p
			} );
		
		}
	};
	
	this.lookingAt = function() {
		var p = PAVO.player.position;
		var i, il, d;
		
		for (i = 0, il = item.length; i < il; i++) {
			d = item[i].position.distance(p);
			if (d < 10)
				return item[i];
		}
		return null;
	};
	
	this.generate = function() {
		var i, il;
	
		program = FOAM.shaders.get("item");
		mesh = new FOAM.Mesh();
		mesh.add(program.position, 3);
		mesh.add(program.texturec, 2);
		
		for (i = 0, il = item.length; i < il; i++) {
			PAVO.models.createItem(mesh, item[i].position);
		}
		
		mesh.build(false, true);
	
	};
	
	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player.camera;
		var program;
	
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

		program = FOAM.shaders.activate("item");
		
		gl.uniformMatrix4fv(program.projector, false, cam.projector());
		gl.uniformMatrix4fv(program.modelview, false, cam.modelview());
		FOAM.textures.bind(0, program.panels, "items");
		mesh.draw();

		gl.disable(gl.CULL_FACE);
	};

};

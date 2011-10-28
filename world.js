/**

	World Object
	Maintains all actor, map, and narrative objects,
	handling all interactions among them.

**/

PAVO.world = new function() {

	var self = this;

	var map;
	var activeMap;

	this.init = function(defines) {
	
		PAVO.decals.init();
		PAVO.space.init();
		PAVO.player.init();
		
		PAVO.space.generate(defines.space);
		PAVO.player.position.copy(defines.space.start);
	};
	
	this.update = function() {
		PAVO.player.update();
	};
	
	this.draw = function() {
		var gl = FOAM.gl;

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		PAVO.space.draw();
	};
};

/**
	maintain npc, space, and narrative objects
	
	@namespace PAVO
	@class world
**/

PAVO.world = new function() {

	var self = this;
	
	/**
		initialize all game objects and start the game running
		
		@method init
	**/

	this.init = function() {
		PAVO.makePlayer();

		PAVO.space.init();
		PAVO.player.init();
		PAVO.ghosts.init();
		PAVO.panels.init();
		PAVO.dialogue.init("#narratives");
		
		// position and orient the player
		PAVO.player.position.copy(PAVO.game.player.position);
		PAVO.player.turn(0, PAVO.game.player.rotation * Math.PI, 0);

		PAVO.space.generate();
		
		PAVO.hud.start();
	};
	
	/**
		update all game objects that require it
		
		execute on every animation frame
		
		@method update
	**/

	this.update = function() {
		PAVO.ghosts.update();
		PAVO.player.update();
	};
	
	/**
		draw all drawable objects
		
		execute on every animation frame
		
		@method draw
	**/

	this.draw = function() {
		var gl = FOAM.gl;
		var cam = PAVO.player.camera;
		var program;
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

		PAVO.space.draw();
		PAVO.ghosts.draw();
		PAVO.panels.draw();
					
		gl.disable(gl.CULL_FACE);
	};
};

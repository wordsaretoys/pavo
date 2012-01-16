/**
	specify certain game parameters
	more of an settings file than a code module
	
	@namespace PAVO
	@class game
**/


PAVO.game = {

	// parameters to generate the game space
	space: {
		size: { x: 128, y: 8, z: 128 },
		field: { 
			seed: 349885726,
			scale: { x: 0.53, y: 0.1, z: 0.61 }
		},
		color: {
			seed: 238747483,
			scale: { x: 0.05, y: 0.05, z: 0.05 }
		},
		light: {
			seed: 583939004,
			scale: { x: 0.02, y: 0.02, z: 0.02 }
		},
		image: {
			seed: 599894542
		}
	},

	// list of NPC positions and identities
	ghosts: [
		{ 
			position: { x: 108, y: 0, z: 76 },
			name: "barley"
		},
		{ 
			position: { x: 100, y: 0, z: 28 },
			name: "popper"
		},
		{ 
			position: { x: 4, y: 0, z: 52 },
			name: "aura"
		},
		{ 
			position: { x: 60, y: 0, z: 4 },
			name: "knotty"
		},
		{ 
			position: { x: 52, y: 0, z: 68 },
			name: "clearly"
		}
	],
	
	// list of panel positions and orientations
	panels: [
		{ 
			position: { x: 108, y: 0, z: 124 },
			rotation: 1,
			name: "panel"
		},
		{ 
			position: { x: 36, y: 0, z: 68 },
			rotation: 0,
			name: "panel"
		},
		{ 
			position: { x: 4, y: 0, z: 36 },
			rotation: 0.5,
			name: "panel"
		},
		{ 
			position: { x: 36, y: 0, z: 12 },
			rotation: 1,
			name: "panel"
		},
		{ 
			position: { x: 36, y: 0, z: 36 },
			rotation: 0.5,
			name: "panel"
		},

	],
	
	// player starting position and orientation
	player: {
		position: { x: 124, y: 0, z: 92 },
		rotation: 0.25
	}
};


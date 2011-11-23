PAVO.game = {

	space: {
		size: { x: 512, y: 64, z: 512 },
		field: { 
			seed: 349875648,
			scale: { x: 0.04, y: 0.1, z: 0.04 }
		},
		color: {
			seed: 238747483,
			scale: { x: 0.05, y: 0.05, z: 0.05 }
		},
		light: {
			seed: 583939094,
			scale: { x: 0.02, y: 0.02, z: 0.02 },
			power: 2,
			base: 0
		},
		panel: {
			seed: 209348
		}
	},

	ghosts: [
		{ position: { x: 4, y: 4, z: 508 } },
		{ position: { x: 140, y: 12, z: 444 } },
		{ position: { x: 140, y: 4, z: 472 } },
		{ position: { x: 308, y: 44, z: 508 } },
		{ position: { x: 460, y: 60, z: 476 } },
		{ position: { x: 476, y: 52, z: 388 } },
		{ position: { x: 508, y: 52, z: 324 } },
		{ position: { x: 500, y: 52, z: 236 } },
		{ position: { x: 500, y: 60, z: 188 } },
		{ position: { x: 500, y: 12, z: 140 } },
		{ position: { x: 508, y: 20, z: 4 } },
		{ position: { x: 116, y: 28, z: 76 } },
		{ 
			position: { x: 36, y: 2, z: 28 },
			name: "medium barley"
		},
		{ position: { x: 4, y: 4, z: 244 } },
		{ position: { x: 508, y: 4, z: 300 } },
		{ position: { x: 108, y: 12, z: 276 } },
		{ position: { x: 364, y: 4, z: 308 } },
		{ position: { x: 68, y: 4, z: 4 } },
		{ position: { x: 124, y: 4, z: 460 } }
	],
	
	player: {
		position: { x: 10, y: 10, z: 10 },
		rotation: { x: 0, y: 1, z: 0, w: 2 }
	}
};


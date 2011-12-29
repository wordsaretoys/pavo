PAVO.game = {

	space: {
		size: { x: 128, y: 32, z: 128 },
		field: { 
			seed: 349885716,
			scale: { x: 0.1, y: 0.1, z: 0.1 }
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
			seed: 209348
		}
	},

	ghosts: [
		{ 
			position: { x: 28, y: 0, z: 52 },
			name: "popper"
		},
	],
	
	panels: [
/*		{ 
			position: { x: 36, y: 0, z: 54 },
			rotation: 1,
			name: "panel alpha"
		},
*/
	],
	
	player: {
		position: { x: 44, y: 16, z: 28 },
		rotation: 3 * Math.PI / 4
	}
};


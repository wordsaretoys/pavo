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
	
	bots: {
		boz: {
			start: { x: 10, y: 10, z: 20 },
			color: 0.7
		}
	},
	
	items: {
		count: 1000,
		size: 1,
		base: {
			/* put item names, properties, and normalized count here */
		},
		special: {
			/* put item names, properties, and locations here */
		}
	},
	
	player: {
		position: { x: 10, y: 10, z: 10 },
		rotation: { x: 0, y: 1, z: 0, w: 2 }
	}
};


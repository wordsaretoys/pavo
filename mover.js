/**
	construct a mover object

	movers inherit from FOAM.Thing
	and support independent pitch and yaw rotation
	
	@namespace PAVO
	@class Mover
	@constructor
**/

PAVO.Mover = function() {
	this.PITCH_LIMIT = Math.sqrt(2) / 2;
	this.pitch = new FOAM.Thing();
	// inherit from ancestor's scratch objects, if present
	this.scratch = this.scratch || {};
	jQuery.extend(this.scratch, {
		rotation: new FOAM.Quaternion()
	} );
	// orientation vectors will be treated as quaternions
	// and need a w-component for copies to be meaningful		
	this.pitch.orientation.right.w = 0;
	this.pitch.orientation.up.w = 0;
	this.pitch.orientation.front.w = 0;
};

PAVO.Mover.proto = {

	/**
		rotate the object

		@method spin
		@param yaw angle to rotate around y-axis
		@param pitch angle to rotate around x-axis
	**/

	spin: function(yaw, pitch) {
		// clumsy, but it works. rotate the first quaternion by
		// pitch angle, then use its orientation vectors as the
		// basis vectors for the yaw rotation. insures no roll!
		this.scratch.rotation.copy(this.pitch.rotation);
		this.pitch.turn(pitch, 0, 0);
		if (this.pitch.rotation.w < this.PITCH_LIMIT) {
			this.pitch.rotation.copy(this.scratch.rotation);
			this.pitch.turn(0, 0, 0);
		}
		this.unitquat.x.copy(this.pitch.orientation.right);
		this.unitquat.y.copy(this.pitch.orientation.up);
		this.unitquat.z.copy(this.pitch.orientation.front);
		this.turn(0, yaw, 0);
	}
};

/**

	create a mover object
	
	JS doesn't support multiple inheritance, so we "assemble"
	a prototype object by pasting methods onto a thing object

	@method makeMover
	@return a new mover object
**/

PAVO.makeMover = function() {
	PAVO.Mover.prototype = new FOAM.Thing();
	jQuery.extend(PAVO.Mover.prototype, PAVO.Mover.proto);
	return new PAVO.Mover();
};


/**

	Puzzle Object
	Implements a simple generative puzzle.
	
**/

PAVO.puzzle = new function() {

	var self = this;
	var prng = new FOAM.Prng();

	this.init = function() {
	};
	
	this.generate = function() {
		var size = PAVO.game.board.size;
		var board = [];
		var i, il;
		for (i = 0, il = size * 2; i < il; i++) {
			board[i] = (i != size) ? 0 : 1;
		}
		return board;
	};
	
};

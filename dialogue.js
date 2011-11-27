/**

	Dialogue Object
	Maintains the dialogue components.
	
**/

PAVO.dialogue = new function() {

	var KW_LIST_SIZE = 8;

	var keyword = [
		"factory", "dead", "here", "inside", "sun", "blinding", "explode", "search",
		"funky", "planet", "baseball", "walk", "funny", "gopher", "true", "loads",
		"hurt", "idea", "robot", "ghost", "panel", "broken", "sleeping", "away"
	];

	var self = this;
	var prng = new FOAM.Prng();
	var dom;
	
	this.init = function() {
	
		dom = {
			talk: jQuery("#talk"),
			keywordFrame: jQuery("#talk-keyword-frame"),
			dialogueFrame: jQuery("#talk-dialogue-frame")
		};
	
		dom.talk.resize = function() {
			dom.talk.offset({
				top: 3 * (FOAM.height - dom.talk.height()) / 4,
				left: (FOAM.width - dom.talk.width()) / 2
			});
		};
	
		jQuery(window).bind("resize", function() { 
			dom.talk.resize() 
		});
		
		// disable mouse selection behavior
		dom.talk.bind("mousedown", function() {
			return false;
		} );
	};
	
	this.show = function() {
		PAVO.player.freeze = true;
		this.listKeywords();
		dom.talk.css("display", "block");
		dom.talk.resize();
		jQuery(window).bind("keydown", this.onKeyDown);
	};

	this.hide = function() {
		PAVO.player.freeze = false;
		dom.talk.css("display", "none");
		jQuery(window).unbind("keydown", this.onKeyDown);
	}

	this.listKeywords = function() {
		var ls = keyword.length;
		var lookup = {};
		var i, div, kw;
		dom.keywordFrame.empty();
		for (i = 0; i < KW_LIST_SIZE; i++) {
			div = jQuery(document.createElement("div"));
			do {
				kw = keyword[ Math.floor(prng.get() * ls) ];
			} while(lookup[kw]);
			lookup[kw] = true;
			div.html(kw);
			div.addClass("talk-keyword");
			div.bind("mousedown", function() {
				self.onKeywordSelect(div.html());
			} );
			dom.keywordFrame.append(div);
		}
	};

	this.onKeyDown = function(event) {
		switch(event.keyCode) {
		case FOAM.KEY.TAB:
			self.hide();
			// a bit of a hack: setting this flag
			// to null requires the ghosts object
			// to reset it thus throwing an event
			// over to the HUD object, which then
			// redisplays the talk prompt
			PAVO.ghosts.listening = null;
			break;
		default:
			//window.alert(event.keyCode);
			break;
		}
	};

	this.onKeywordSelect = function(kw) {
		div = jQuery(document.createElement("div"));
		div.html(kw);
		div.addClass("talk-player");
		dom.dialogueFrame.append(div);
	};

}; 

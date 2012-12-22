<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>pavo</title>
		<link rel="stylesheet" type="text/css" media="screen" href="pavo.css">
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>

		<script type="text/javascript" src="foam.js"></script>
		<script type="text/javascript" src="pavo.js"></script>
		<script type="text/javascript" src="game.js"></script>
		<script type="text/javascript" src="hud.js"></script>
		<script type="text/javascript" src="world.js"></script>
		<script type="text/javascript" src="mover.js"></script>
		<script type="text/javascript" src="player.js"></script>
		<script type="text/javascript" src="space.js"></script>
		<script type="text/javascript" src="models.js"></script>
		<script type="text/javascript" src="ghosts.js"></script>
		<script type="text/javascript" src="panels.js"></script>
		<script type="text/javascript" src="dialogue.js"></script>

<?php
include("pavo.glsl");
?>
		<script type="text/javascript">
			jQuery(window).bind("load", function() {
				PAVO.init();
			});
		</script>
    </head>
	<body>
		<canvas id="gl"></canvas>
		<?php include("hud.html"); ?>
	</body>
</html>

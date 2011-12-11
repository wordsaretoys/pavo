<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>pavo</title>
		<link rel="stylesheet" type="text/css" media="screen" href="pavo.css">
		<script type="text/javascript" src="/shared/jquery-1.6.2.min.js"></script>

		<script type="text/javascript" src="/debug/foam/foam.js"></script>
		<script type="text/javascript" src="/debug/foam/resources.js"></script>
		<script type="text/javascript" src="/debug/foam/vector.js"></script>
		<script type="text/javascript" src="/debug/foam/quaternion.js"></script>
		<script type="text/javascript" src="/debug/foam/thing.js"></script>
		<script type="text/javascript" src="/debug/foam/shaders.js"></script>
		<script type="text/javascript" src="/debug/foam/textures.js"></script>
		<script type="text/javascript" src="/debug/foam/camera.js"></script>
		<script type="text/javascript" src="/debug/foam/mesh.js"></script>
		<script type="text/javascript" src="/debug/foam/noise.js"></script>
		<script type="text/javascript" src="/debug/foam/sound.js"></script>

		<script type="text/javascript" src="/debug/pavo/pavo.js"></script>
		<script type="text/javascript" src="/debug/pavo/game.js"></script>
		<script type="text/javascript" src="/debug/pavo/hud.js"></script>
		<script type="text/javascript" src="/debug/pavo/world.js"></script>
		<script type="text/javascript" src="/debug/pavo/mover.js"></script>
		<script type="text/javascript" src="/debug/pavo/player.js"></script>
		<script type="text/javascript" src="/debug/pavo/space.js"></script>
		<script type="text/javascript" src="/debug/pavo/models.js"></script>
		<script type="text/javascript" src="/debug/pavo/signs.js"></script>
		<script type="text/javascript" src="/debug/pavo/ghosts.js"></script>
		<script type="text/javascript" src="/debug/pavo/consoles.js"></script>
		<script type="text/javascript" src="/debug/pavo/dialogue.js"></script>

<?php
include("pavo.glsl");
?>
		<script type="text/javascript">
			window.addEventListener("load", function() {
				PAVO.init();
			});
		</script>
    </head>
	<body>
		<canvas id="gl"></canvas>
		<?php include("hud.html"); ?>
		<?php include("narratives.html"); ?>
	</body>
</html>

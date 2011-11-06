<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Pavo :: Words Are Toys</title>
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
		<script type="text/javascript" src="/debug/pavo/hud.js"></script>
		<script type="text/javascript" src="/debug/pavo/world.js"></script>
		<script type="text/javascript" src="/debug/pavo/player.js"></script>
		<script type="text/javascript" src="/debug/pavo/decals.js"></script>
		<script type="text/javascript" src="/debug/pavo/space.js"></script>
		<script type="text/javascript" src="/debug/pavo/bot.js"></script>

		<script type="text/javascript" src="/debug/pavo/defines.js"></script>
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
	</body>
</html>

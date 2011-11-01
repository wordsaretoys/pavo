<script id="vs-block" type="x-shader/x-vertex">

/**
	block vertex shader
	O' = P * M * V * O transformation, plus texture coordinates
	and color and lighting values
**/

attribute vec3 position;
attribute vec2 texturec;
attribute float a_color;
attribute float a_light;
attribute float a_panel;

uniform mat4 projector;
uniform mat4 modelview;

varying vec2 uv;
varying float color;
varying float light;
varying float panel;

void main(void) {
	gl_Position = projector * modelview * vec4(position, 1.0);
	uv = texturec;
	color = a_color;
	light = a_light;
	panel = a_panel;
}

</script>

<script id="fs-block" type="x-shader/x-fragment">

/**
	block fragment shader
	texture plus light and color
**/

#ifdef GL_ES
precision highp float;
#endif
 
varying vec2 uv;
varying float color;
varying float light;
varying float panel;

uniform sampler2D palette;
uniform sampler2D panels;

void main(void) {
	vec2 st = vec2((uv.x + panel) / 8.0, uv.y);
	vec3 tex0 = texture2D(palette, vec2(0.0, color)).rgb;
	vec4 tex1 = texture2D(panels, st);
	gl_FragColor = vec4(mix(tex0 * light, tex1.rgb * light, tex1.a), 1.0);
}

</script>


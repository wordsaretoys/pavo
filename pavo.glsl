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

uniform mat4 projector;
uniform mat4 modelview;

varying vec2 uv;
varying float color;
varying float light;

void main(void) {
	gl_Position = projector * modelview * vec4(position, 1.0);
	uv = texturec;
	color = a_color;
	light = a_light;
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

uniform sampler2D palette;
uniform sampler2D panels;

void main(void) {
	vec3 tex0 = texture2D(palette, vec2(0.0, color)).rgb;
	vec3 tex1 = texture2D(panels, uv).rgb;
	gl_FragColor = vec4(tex0 * tex1 * light, 1.0); 
}

</script>


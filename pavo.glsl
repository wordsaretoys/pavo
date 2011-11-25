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
	gl_FragColor = vec4(light * mix(tex0, tex1.rgb, tex1.a), 1.0);
}

</script>

<script id="vs-bot" type="x-shader/x-vertex">

/**
	bot vertex shader
**/

attribute vec3 position;
attribute vec2 texturec;

uniform mat4 projector;
uniform mat4 modelview;
uniform mat4 rotations;
uniform vec3 center;

varying vec2 uv;

void main(void) {
	vec4 rotpos = rotations * vec4(position, 1.0) + vec4(center, 0.0);
	gl_Position = projector * modelview * rotpos;
	uv = texturec;
}

</script>

<script id="fs-bot" type="x-shader/x-fragment">

/**
	bot fragment shader
**/

#ifdef GL_ES
precision highp float;
#endif
 
varying vec2 uv;

uniform sampler2D panels;
uniform float alpha;

void main(void) {
	vec2 st = vec2(uv.x / 4.0, uv.y);
	vec3 base = vec3(1.0, 1.0, 1.0);
	vec4 tex = texture2D(panels, st);
	gl_FragColor = vec4(mix(base, tex.rgb, tex.a), alpha);
}

</script>

<script id="vs-ghost" type="x-shader/x-vertex">

/**
	ghost vertex shader
**/

attribute vec3 position;
attribute vec2 texturec;

uniform mat4 projector;
uniform mat4 modelview;
uniform mat4 rotations;
uniform vec3 center;

varying vec2 uv;

void main(void) {
	vec4 rotpos = rotations * vec4(position, 1.0) + vec4(center, 0.0);
	gl_Position = projector * modelview * rotpos;
	uv = texturec;
}

</script>

<script id="fs-ghost" type="x-shader/x-fragment">

/**
	ghost fragment shader
**/

#ifdef GL_ES
precision highp float;
#endif
 
varying vec2 uv;

uniform sampler2D panels;
uniform float alpha;

void main(void) {
	vec2 st = vec2(uv.x / 4.0, uv.y);
	vec3 base = vec3(1.0, 1.0, 1.0);
	vec4 tex = texture2D(panels, st);
	gl_FragColor = vec4(mix(base, tex.rgb, tex.a), alpha);
}

</script>

<script id="vs-debris" type="x-shader/x-vertex">

/**
	debris vertex shader
	O' = P * M * V * O transformation, plus texture coordinates
**/

attribute vec3 position;
attribute vec2 texturec;

uniform mat4 projector;
uniform mat4 modelview;
uniform vec3 center;

varying vec2 uv;

void main(void) {
	gl_Position = projector * modelview * vec4(position + center, 1.0);
	uv = texturec;
}

</script>

<script id="fs-debris" type="x-shader/x-fragment">

/**
	debris fragment shader
**/

#ifdef GL_ES
precision highp float;
#endif
 
varying vec2 uv;

uniform sampler2D panels;
uniform float alpha;

void main(void) {
	vec4 tex = texture2D(panels, uv);
	gl_FragColor = vec4(tex.rgb, alpha * tex.a);
}

</script>


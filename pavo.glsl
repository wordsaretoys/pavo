/**
	shader programs

	@namespace PAVO
**/

<script id="vs-block" type="x-shader/x-vertex">

/**
	block vertex shader
	O' = P * M * V * O transformation, plus texture coordinates
	and color and lighting values
	
	@param position vertex array of positions
	@param texturec vertex array of texture coordinates
	@param a_color  vertex array of color indicies
	@param a_light  vertex array of light intensities
	@param a_image  vertex array of image indicies
	
	@param projector projector matrix
	@param modelview modelview matrix
	
	(passed to fragment shader for each vertex)
	@uv		texture coordinates
	@color	color index
	@light	light intensity
	@image	image index
	
**/

attribute vec3 position;
attribute vec2 texturec;
attribute float a_color;
attribute float a_light;
attribute float a_image;

uniform mat4 projector;
uniform mat4 modelview;

varying vec2 uv;
varying float color;
varying float light;
varying float image;

void main(void) {
	gl_Position = projector * modelview * vec4(position, 1.0);
	uv = texturec;
	color = a_color;
	light = a_light;
	image = a_image;
}

</script>

<script id="fs-block" type="x-shader/x-fragment">

/**
	block fragment shader, texture plus light and color
	
	@param uv		texture coordinates
	@param color	color index
	@param light	light intensity
	@param image	image index

	@param palette	2D array of color values
	@param images	sprite containing block texture images
	
**/

precision mediump float;
 
varying vec2 uv;
varying float color;
varying float light;
varying float image;

uniform sampler2D palette;
uniform sampler2D images;

void main(void) {
	// generate normalized texture coordinates for the specified sprite
	vec2 st = vec2((uv.x + image) / 8.0, uv.y);
	// get pixel values for color and image
	vec3 tex0 = texture2D(palette, vec2(0.0, color)).rgb;
	vec4 tex1 = texture2D(images, st);
	// overlay the image on the color, mixing by image alpha value
	// adjust for light intensity
	gl_FragColor = vec4(light * mix(tex0, tex1.rgb, tex1.a), 1.0);
}

</script>

<script id="vs-ghost" type="x-shader/x-vertex">

/**
	ghost vertex shader
	O' = P * M * V * (R * O + C) transformation, plus texture coordinates

	@param position vertex array of positions
	@param texturec vertex array of texture coordinates
	
	@param projector projector matrix
	@param modelview view matrix
	@param rotations matrix representing model rotation
	@param center position of model center
	
	(passed to fragment shader for each vertex)
	@parma uv texture coordinates

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

	@param uv texture coordinates

	@param images sprite containing ghost texture images
	@param alpha opacity value for entire model
	
**/

precision mediump float;
 
varying vec2 uv;

uniform sampler2D images;
uniform float alpha;

void main(void) {
	// normalize texture coordinates for sprite
	vec2 st = vec2(uv.x / 4.0, uv.y);

	vec3 base = vec3(1.0, 1.0, 1.0);
	vec4 tex = texture2D(images, st);

	// blend base color and image pixels based on image alpha
	gl_FragColor = vec4(mix(base, tex.rgb, tex.a), alpha);
}

</script>

<script id="vs-panel" type="x-shader/x-vertex">

/**
	panel vertex shader
	O' = P * M * V * (R * O + C) transformation, plus texture coordinates

	@param position vertex array of positions
	@param texturec vertex array of texture coordinates
	
	@param projector projector matrix
	@param modelview view matrix
	@param rotations matrix representing model rotation
	@param center position of model center
	
	(passed to fragment shader for each vertex)
	@parma uv texture coordinates
	@param top indicates whether vertex intersects top of model

**/

attribute vec3 position;
attribute vec2 texturec;

uniform mat4 projector;
uniform mat4 modelview;
uniform mat4 rotations;
uniform vec3 center;

varying vec2 uv;
varying float top;

void main(void) {
	vec4 rotpos = rotations * vec4(position, 1.0) + vec4(center, 0.0);
	gl_Position = projector * modelview * rotpos;
	uv = texturec;
	// if texture coordinates are negative
	// the vertex is on top of the model
	if (uv.x < 0.0 || uv.y < 0.0) {
		top = 1.0;
		uv = -uv;
	} else {
		top = 0.0;
	}
}

</script>

<script id="fs-panel" type="x-shader/x-fragment">

/**
	ghost fragment shader

	@param uv texture coordinates
	@param top indicates whether vertex intersects top of model

	@param images sprite containing panel texture images
	@param alpha opacity value for entire model
	@param phase index of frame in animation cycle
	
**/

precision mediump float;
 
varying vec2 uv;
varying float top;

uniform sampler2D images;
uniform float alpha;
uniform float phase;

void main(void) {
	vec2 st;
	// if this fragment is on top of the model
	if (top > 0.0) {
		// generate normalized texture coordinates for the specified sprite
		st = vec2((uv.x + phase) / 8.0, uv.y);
	} else {
		// just normalize the coordinates
		st = vec2(uv.x / 8.0, uv.y);
	}
	
	vec3 base = vec3(0.25, 0.25, 0.3);
	vec4 tex = texture2D(images, st);

	// blend base color and image pixels based on image alpha
	gl_FragColor = vec4(mix(base, tex.rgb, tex.a), alpha);
}

</script>


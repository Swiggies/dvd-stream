// Import Two.js from a CDN
import Two from 'https://cdn.skypack.dev/two.js@latest';

// Initialize an instance to render
// render to the screen. Try changing
// the `type` property to:
//   Two.Types.canvas
//   Two.Types.webgl
// To see different rendering styles.
const two = new Two({
	type: Two.Types.svg,
	fullscreen: true,
	autostart: true
}).appendTo(document.body);

// Random colors
var colorArray = ['white', 'red', 'yellow', 'lightblue'];

// Change the background
two.renderer.domElement.style.background = '#00000000';

const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);

// The font styles to apply to
// all text in the scene.
const styles = {
	family: 'roboto, sans-serif',
	size: 50,
	leading: 50,
	weight: 500,
	stroke: '#00000033',
};

const isMobile = window.navigator.maxTouchPoints > 0;
var message = urlParams.get('text');
if (message == null) {
	message = "Text";
}

const dir = two.makeText(message, two.width / 2, two.height / 2, styles);
dir.fill = "#fff"

// Add callbacks to events that Two.js triggers.
two.bind('resize', resize);
two.bind('update', update);

// Set the position of the directions
// to the center of the page.
function resize() {
	dir.translation.set(two.width / 2, two.height / 2);
}

function reflect(vec, normal) {
	let dn = 2 * vec.dot(normal);
	let v = vec.sub(normal.multiply(dn));
	return v;
}

function bounce(normal) {
	dir.fill = colorArray[Math.floor(Math.random() * colorArray.length)];
	return reflect(currentVector, normal);
}

var speed = urlParams.get('speed');
if (speed == null) { speed = 1; }
var textWidth, textHeight;
var currentVector = new Two.Vector(1, 1).normalize().multiply(parseFloat(speed));
var s = dir.getBoundingClientRect();

// Debug stuff to figure out the size of the text
// var shape = two.makeRectangle(two.width / 2, two.height / 2, s.width, s.height);
// shape.fill = '#ffffffaa';

var timer = 0;
var setup = false;

// An update callback that is called every time
// the scene is rendered. Think of this as an
// animation loop.
function update() {
	// I hate this
	if (!setup) timer += 1;
	if (timer >= 3) {
		onTextLoad();
		setup = true;
		timer = 0;
	}

	if (dir.position.y + textHeight >= two.height) {
		currentVector = bounce(new Two.Vector(0, 1));
	}
	if (dir.position.x + textWidth >= two.width) {
		currentVector = bounce(new Two.Vector(-1, 0));
	}
	if (dir.position.y - textHeight <= 0) {
		currentVector = bounce(new Two.Vector(0, -1));
	}
	if (dir.position.x - textWidth <= 0) {
		currentVector = bounce(new Two.Vector(1, 0));
	}
	dir.position.add(currentVector);
}

function onTextLoad() {
	var e = document.getElementById('two-1');
	var cs = e.getBoundingClientRect();
	textWidth = cs.width / 2;
	textHeight = cs.height / 2;
}
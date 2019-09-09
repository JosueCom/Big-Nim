/*const app = new PIXI.Application({transparent: true, width: window.innerWidth, height: window.innerHeight});

document.body.appendChild(app.view);

app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);



// create a texture from an image path
const texture = PIXI.Texture.from("assets/images/x.png");


// Scale mode for pixelation
texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

for (let i = 0; i < 10; i++) {
    createX(
        Math.floor(Math.random() * 0.9 * app.screen.width),
        Math.floor(Math.random() * 0.9 * app.screen.height),
    );
}

function createX(x, y) {
    // create our little bunny friend..
    const bunny = new PIXI.Sprite(texture);

    // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    bunny.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    bunny.buttonMode = true;

    // center the bunny's anchor point
    bunny.anchor.set(0.5);

    // make it a bit bigger, so it's easier to grab
    bunny.scale.set(0.2);

    // setup events for mouse + touch using
    // the pointer events
    bunny
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    // For mouse-only events
    // .on('mousedown', onDragStart)
    // .on('mouseup', onDragEnd)
    // .on('mouseupoutside', onDragEnd)
    // .on('mousemove', onDragMove);

    // For touch-only events
    // .on('touchstart', onDragStart)
    // .on('touchend', onDragEnd)
    // .on('touchendoutside', onDragEnd)
    // .on('touchmove', onDragMove);

    // move the sprite to its designated position
    bunny.x = x;
    bunny.y = y;

    // add it to the stage
    app.stage.addChild(bunny);
}

function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}

function setup(){
    
}*/

const app = new PIXI.Application({transparent: true, width: window.innerWidth - 20, height: window.innerHeight - 20});

document.body.appendChild(app.view);

var xs_cont = new PIXI.Container();

const graphics = new PIXI.Graphics();

PIXI.loader
	.add("assets/images/x.png")
	.load(setup);

let dragging = [-1, -1];
let isDrawing = false;
let level = -1;
const map = [3, 5, 7];
let map_play = [[1, 1, 1, 0, 0, 0, 0], 
				[1, 1, 1, 1, 1, 0, 0], 
				[1, 1, 1, 1, 1, 1, 1]];

let ai = new AI();

function setup() {

	let rows = createXs(xs_cont);

	for (var i = 0; i < rows.length; i++) {
		xs_cont.addChild(rows[i]);
	}

	xs_cont.position.x = (app.stage.width / 2) + (xs_cont.width / 2);
	xs_cont.position.y = (app.stage.height / 2) + (xs_cont.width / 2);

	app.stage.addChild(xs_cont);
	app.stage.addChild(graphics);

	gameloop();

}

function createXs(cont) {

	let level_cont = [new PIXI.Container(),
						new PIXI.Container(),
						new PIXI.Container()];

	//Add xs to appropiate row
	for (var i = 0; i < map.length; i++) {
		let xs = createXRow(i, map[i], map[map.length - 1]);

		for (var j = 0; j < xs.length; j++) {
			level_cont[i].addChild(xs[j]);
		}

		//level_cont[i].position.x = (cont.width / 2) - (level_cont[i].width / 2);
		level_cont[i].position.y = i * 100;
		level_cont[i].interactive = true;
		level_cont[i].level = i;
		level_cont[i].on('pointerup', onDragRowEnd);
	}

	return level_cont;
}

function createXRow(level, n, l) {
	let xs = [];

	for (var i = 0; i < n; i++) {
		let x_icon = createX((i + (l-n)/2) * 100, level);
		x_icon.id = i;

		xs.push(x_icon);
	}

	return xs;
}

function createX(x, y) {

	let x_texture = PIXI.loader.resources["assets/images/x.png"].texture;

	const x_icon = new PIXI.Sprite(x_texture);

    x_icon.interactive = true;

    x_icon.buttonMode = true;

    x_icon.anchor.set(0.5);

    x_icon.scale.set(0.15);

    x_icon
        .on('pointerdown', onDragXStart)
        .on('pointerup', onDragXEnd);

    x_icon.x = x;
    x_icon.y = y;

	return x_icon;
}

function onDragXStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    isDrawing = true;
    dragging[0] = this.id;
}

function onDragXEnd() {
    // set the interaction data to null

    dragging[1] = this.id;
    this.data = null;
}

function onDragRowEnd() {
    level = this.level;

    isDrawing = false;
    console.log(dragging);
    console.log(level);

    drawLine(level, dragging);
}

function drawLine(level, set){
	graphics.lineStyle(6, 0x0000ff);
	graphics.beginFill(0x650A5A);

	let x_pos1 = xs_cont.children[level].children[set[0]].x + xs_cont.children[level].x + xs_cont.x;
	let y_pos1 = xs_cont.children[level].children[set[0]].y + xs_cont.children[level].y + xs_cont.y;
	let x_pos2 = xs_cont.children[level].children[set[1]].x + xs_cont.children[level].x + xs_cont.x;
	let y_pos2 = xs_cont.children[level].children[set[1]].y + xs_cont.children[level].y + xs_cont.y;


	graphics.drawRoundedRect(x_pos1, y_pos1, x_pos2-x_pos1, 5, 1);
	graphics.endFill();
}

function hasGameEnded(map){
	let count = 0;

	for (var i = 0; i < map.length; i++) {
		for (var j = 0; j < map[i].length; j++) {
			if (map[i][j] == 1) count++;
		}
	}

	return count > 0;
}

function gameloop(){

}

const app = new PIXI.Application({transparent: true, width: window.innerWidth - 20, height: window.innerHeight - 20});

document.body.appendChild(app.view);

var xs_cont = new PIXI.Container();

const graphics = new PIXI.Graphics();

let ai = new AI();

PIXI.loader
	.add("assets/images/x.png")
	.load(setup);

let dragging = [-1, -1];
let isDrawing = false;
let playerTurn = true;
let level = -1;
const map = [3, 5, 7];
let map_play = [[1, 1, 1, 0, 0, 0, 0], 
				[1, 1, 1, 1, 1, 0, 0], 
				[1, 1, 1, 1, 1, 1, 1]];

setInterval(gameloop, 500);

function setup() {

	let rows = createXs(xs_cont);

	for (var i = 0; i < rows.length; i++) {
		xs_cont.addChild(rows[i]);
	}

	xs_cont.position.x = (app.stage.width / 2) + (xs_cont.width / 2);
	xs_cont.position.y = (app.stage.height / 2) + (xs_cont.width / 2);

	app.stage.addChild(xs_cont);
	app.stage.addChild(graphics);

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

    dragging[1] = Math.max(this.id, dragging[0]);
    dragging[0] = Math.min(this.id, dragging[0]);

    this.data = null;
}

function onDragRowEnd() {
    level = this.level;

    isDrawing = false;
    console.log(dragging);
    console.log(level);

    if (playerTurn  && !hasGameEnded()) {
	    drawLine(level, dragging, 0x00ff00);

	    updateMap(level, dragging);

	    playerTurn = false;

	    if (hasGameEnded()) {
			alert("You have won the game! If you want to know how we did this and other things, you should come to our club.");
			location.reload();
		}
    }
}

function drawLine(level, set, color){
	graphics.lineStyle(6, color, 0.9);
	graphics.beginFill(color); //0x650A5A

	let x_pos1 = xs_cont.children[level].children[set[0]].x + xs_cont.children[level].x + xs_cont.x;
	let y_pos1 = xs_cont.children[level].children[set[0]].y + xs_cont.children[level].y + xs_cont.y;
	let x_pos2 = xs_cont.children[level].children[set[1]].x + xs_cont.children[level].x + xs_cont.x;
	let y_pos2 = xs_cont.children[level].children[set[1]].y + xs_cont.children[level].y + xs_cont.y;


	graphics.drawRoundedRect(x_pos1, y_pos1, x_pos2-x_pos1, 5, 0.5);
	graphics.endFill();
}

function updateMap(level, set){
	
	for (var i = Math.min(...set); i <= Math.max(...set); i++) {
		map_play[level][i] = 0;
	}
}

function hasGameEnded(){
	let count = 0;

	for (var i = 0; i < map_play.length; i++) {
		for (var j = 0; j < map_play[i].length; j++) {
			if (map_play[i][j] == 1) count++;
		}
	}

	return count <= 1;
}

function gameloop(){

	if(!playerTurn && !hasGameEnded()) {

		let move = ai.play(map_play);

		drawLine(move.level, move.set, 0xff00ff);
		updateMap(move.level, move.set);
		playerTurn = true;

		if (hasGameEnded()) {
			alert("You have lost the game! Now, you must come to our first meeting!");
		}
	}
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}



function AI(){
	this.play = function(map){
		let layout = this.readMap(map);

		return this.decision(map, layout);
		
	}

	this.readMap = function(map){
		let array = new Array(map.length).fill(0);

		for (var i = 0; i < map.length; i++) {
			
			for (var j = 0; j < map[i].length; j++) {
				if(map[i][j] == 1) array[i]++;
			}
		}

		return array;
	}

	this.decision = function(map, layout){
		let move = {"level": 2, "set": [1, 3]}


		if (rowHasNothing(0, layout)) {
			if(layout[1] != layout[2]){
				if(rowHasNothing(1, layout)){
					move.level = 2;
					move.set = getSet(map, layout[2] - 1, layout[2], move.level);
				}else if(rowHasNothing(2, layout)){
					move.level = 1;
					move.set = getSet(map, layout[1] - 1, layout[1], move.level);
				}else if(layout[1] == 1) {
					move.level = 2;
					move.set = getSet(map, layout[2], layout[2], move.level);
				}else if(layout[2] == 1) {
					move.level = 1;
					move.set = getSet(map, layout[1], layout[1], move.level);
				}else{
					move.level = layout[1] > layout[2] ? 1 : 2;
					let other = layout[1] > layout[2] ? 2 : 1;

					let diff = layout[move.level] - layout[other];

					move.set = getSet(map, diff, layout[move.level], move.level);
				}
			}else{
				move.level = 1;
				move.set = getSet(map, 1, layout[1], move.level);
			}

		}else if(rowHasNothing(1, layout)){
			if(layout[0] != layout[2]){
				if(rowHasNothing(0, layout)){
					move.level = 2;
					move.set = getSet(map, layout[2] - 1, layout[2], move.level);
				}else if(rowHasNothing(2, layout)){
					move.level = 0;
					move.set = getSet(map, layout[0] - 1, layout[0], move.level);
				}else if(layout[0] == 1) {
					move.level = 2;
					move.set = getSet(map, layout[2], layout[2], move.level);
				}else if(layout[2] == 1) {
					move.level = 0;
					move.set = getSet(map, layout[0], layout[0], move.level);
				}else{
					move.level = layout[0] > layout[2] ? 0 : 2;
					let other = layout[0] > layout[2] ? 2 : 0;

					let diff = layout[move.level] - layout[other];

					move.set = getSet(map, diff, layout[move.level], move.level);
				}
			}else{
				move.level = 0;
				move.set = getSet(map, 1, layout[0], move.level);
			}
		}else if(rowHasNothing(2, layout)){
			if(layout[0] != layout[1]){
				if(rowHasNothing(0, layout)){
					move.level = 1;
					move.set = getSet(map, layout[1] - 1, layout[1], move.level);
				}else if(rowHasNothing(1, layout)){
					move.level = 0;
					move.set = getSet(map, layout[0] - 1, layout[0], move.level);
				}else if(layout[0] == 1) {
					move.level = 1;
					move.set = getSet(map, layout[2], layout[2], move.level);
				}else if(layout[1] == 1) {
					move.level = 0;
					move.set = getSet(map, layout[0], layout[0], move.level);
				}else{
					move.level = layout[0] > layout[1] ? 0 : 1;
					let other = layout[0] > layout[1] ? 1 : 0;

					let diff = layout[move.level] - layout[other];

					move.set = getSet(map, diff, layout[move.level], move.level);
				}
			}else{
				move.level = 1;
				move.set = getSet(map, 1, layout[1], move.level);
			}
		}else{
			move.level = getRandomInt(layout.length);
			move.set = getSet(map, 1, layout[move.level], move.level);
		}

		return move;
	}
}

function rowHasNothing(row, layout){
	return layout[row] <= 0;
}

function getSet(map, n, max, level){
	let start = 0, end = 0, count = 0;


	console.log("Hey2");

	while(map[level][start] != 1) start++;

	end = start;
	count = 1;

	console.log("Hey");

	while(count < n && count < max) {
		end++;

		if(map[level][end] == 1){
			count++;

			if (count >= n) {return [start, end]}
		}
	}

	return [start, end];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
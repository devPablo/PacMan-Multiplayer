window.onload=function() {
	document.addEventListener('keydown', keyPush);
    setInterval(game, 200);
}

// Variable initialization
let wrapper = document.querySelector('#wrapper');
let c = document.querySelector('#mainBoard');
c.addEventListener('mouseleave', mouseLeaveEvent);

let buttonResetMap = document.querySelector('#button-reset-map');
let buttonLoadMap = document.querySelector('#button-load-map');
let buttonSaveMap = document.querySelector('#button-save-map');

buttonResetMap.addEventListener('click', resetMap);
buttonLoadMap.addEventListener('click', loadMap);
buttonSaveMap.addEventListener('click', saveMap);

// Objects
let buttonObjectWall = document.querySelector('#button-object-wall');
let buttonObjectPoint = document.querySelector('#button-object-point');
let buttonObjectPacMan = document.querySelector('#button-object-pacman');


buttonObjectWall.addEventListener('click', selectObject);
buttonObjectPoint.addEventListener('click', selectObject);
buttonObjectPacMan.addEventListener('click', selectObject);




let gs = 625; // Grid squares
let map = [];
let saved_maps = [];
let active_object = 'WALL';

let left_click_drag_flag = false;
let right_click_drag_flag = false;

drawMap();
selectObject('WALL');

// Grid default values;
function loadMap() {
	let grid_data = [];
	name = prompt("Map name: ");
	for (let i = 0; i < gs; i++) {
		grid_data.push(JSON.parse(localStorage.getItem(name))[i]);
	}
	map = grid_data;
	drawMap();
}

function drawMap() {
	c.innerHTML = '';
	let custom_map_flag = map.length != 0;

	for (let i = 0; i < gs; i++) {
		let wall = document.createElement('div');
		
		if (custom_map_flag) {
			let grid = map[i];
			// Check for object types
			switch (map[i].type) {
				case 'WALL':
					createGrid(wall, 'WALL');
					break;
				case 'POINT':
					createGrid(wall, 'POINT');
					break;
				case 'PACMAN':
					createGrid(wall, 'PACMAN');
					break;
				default:
					deleteGrid(wall);
					break;
			}
			c.appendChild(wall);
		} else {
			wall.style.backgroundColor = '#FFF';
			wall.style.border = '1px solid #E5E5E5';
		}

		wall.addEventListener('mousedown', updateGrid);
		wall.addEventListener('mouseover', mouseOverEvent);
		wall.addEventListener('mouseup', mouseUpEvent);
		wall.classList.add('blank-grid');
		
		c.appendChild(wall);

	}
	addID();
}

// Create the grid on screen
function createGrid(grid, type) {
	deleteGrid(grid);
	grid.classList.remove('empty-grid');
	grid.classList.remove('wall-grid');
	grid.classList.remove('point-grid');
	grid.classList.remove('pacman-grid');
	switch (type) {
		case 'EMPTY':
			wall.classList.add('empty-grid');
			wall.style.backgroundColor = '#FFF';
			wall.style.border = '1px solid #E5E5E5';
		case 'WALL':
			grid.classList.add('wall-grid');
			grid.style.border = '1px solid #BEBEBE';
			grid.style.backgroundColor = '#E5E5E5';
			break;
		case 'POINT':
			let point = document.createElement('div');
			grid.classList.add('point-grid');
			grid.style.backgroundColor = "transparent";
			point.style.backgroundColor = '#F8B090';
			point.style.borderRadius = '50%';
			point.style.padding = '10px';
			point.style.transform = 'scale(0.2)';
			point.style.position = 'absolute';
			grid.appendChild(point);
			break;
		case 'PACMAN':
			let pacman = document.createElement('div');
			grid.classList.add('pacman-grid');
			grid.style.backgroundColor = "transparent";
			pacman.style.backgroundColor = '#26A69A';
			pacman.style.borderRadius = '50%';
			pacman.style.padding = '10px';
			pacman.style.transform = 'scale(0.6)';
			pacman.style.position = 'absolute';
			grid.appendChild(pacman);
			break;
	}	
	grid.addEventListener('mousedown', updateGrid);
	grid.addEventListener('mouseover', mouseOverEvent);
	grid.addEventListener('mouseup', mouseUpEvent);

	addID();
}

// Delete the grid on screen
function deleteGrid(grid) {
	grid.classList.remove('wall-grid');
	grid.classList.remove('point-grid');
	grid.classList.remove('pacman-grid');
	grid.classList.add('empty-grid');

	grid.removeAttribute('style');
	grid.innerHTML = '';
	grid.style.border = '1px solid #E5E5E5';
	grid.style.backgroundColor = '#FFF';	
}

// Create the grid
function updateGrid(e) {
	switch (e.button) {
		case 0:
			left_click_drag_flag = true;
			createGrid(this, active_object);
			
			break;
		case 2:
			right_click_drag_flag = true;
			deleteGrid(this);	
			break;
	}		
}

// Checks for flag -> draws
function mouseOverEvent(e) {
	if (e.button == 0) {
		if (left_click_drag_flag) {
			createGrid(this, active_object);
		}
	}
	if (e.buttons == 2) {
		if (right_click_drag_flag) {
			deleteGrid(this);
		}
	}
 }

// Checks for flag -> stop drawing
function mouseUpEvent(e) {
	switch (e.button) {
		case 0:
			left_click_drag_flag = false;			
			break;
		case 2:
			right_click_drag_flag = false;
			break;
	}
}

// Checks if mouse has reached out of bounds
function mouseLeaveEvent() {
	left_click_drag_flag = false;
	right_click_drag_flag = false;
}

// Save current map
function saveMap(id, name) {
	let grid_data = [];
	let type;
	let background;
	let border;
	let borderRadius;
	let padding;
	let transform;
	let position;
	
	for (let i = 0; i < gs; i++) {
		background = getGrid(i).style.backgroundColor;

		if (getGridClass(i).includes('wall-grid')) {
			type = 'WALL';
			border = getGrid(i).style.border
		}
		if (getGridClass(i).includes('point-grid')) {
			type = 'POINT';
			borderRadius = getGrid(i).childNodes[0].style.borderRadius;
			padding = getGrid(i).childNodes[0].style.padding;
			transform = getGrid(i).childNodes[0].style.transform;
			position = getGrid(i).childNodes[0].style.position;
		}
		if (getGridClass(i).includes('pacman-grid')) {
			type = 'PACMAN';
			borderRadius = getGrid(i).childNodes[0].style.borderRadius;
			padding = getGrid(i).childNodes[0].style.padding;
			transform = getGrid(i).childNodes[0].style.transform;
			position = getGrid(i).childNodes[0].style.position;
		}
		if (getGridClass(i).includes('default-grid')) {
			type = 'DEFAULT';
		}
		
		let data = {
			id: i,
			type: type,
			background: background,
			border: border,
			borderRadius: borderRadius,
			padding: padding,
			transform: transform,
			position: position
		}
		type = null;
		grid_data.push(data);
	}
	saved_maps.push(grid_data);
	// Temp LocalStorage
	name = prompt('Map name: ');
	localStorage.setItem(name, JSON.stringify(grid_data));
}

function resetMap() {
	map = [];
	drawMap();
}

// Select objects from Object Selection
function selectObject(obj) {
	if (obj == 'WALL') {
		buttonObjectWall.classList.add('button-object-active');
	} else {
		active_object = this.value;
		resetSelectObject();
		this.classList.add('button-object-active');
	}
}

// Reset object selectors, default: WALL
function resetSelectObject() {
	let e = document.getElementsByClassName('button-object');
	for (let i = 0; i < e.length; i++) {
		e[i].classList.remove('button-object-active');
	}
}

// Get information from HTML

// Gets grid as object
function getGrid(pos) {
	let childs = c.childNodes;
	return childs[pos];
}

// Gets classes of grid
function getGridClass(pos) {
	let childs = c.childNodes;
	let classes = childs[pos].className.split(' ');
	return classes;
}







/* ------------------------------------------------------------ */

let player_one = null;
let ready = false;
let left, up, right, down = false;
let queue = 'NONE';

function game() {
	if (ready) {
		if (left) {
			movePlayer('LEFT');
		}
		if (up) {
			movePlayer('UP');		
		}
		if (right) {
			movePlayer('RIGHT');
		}	
		if (down) {
			movePlayer('DOWN');
		}
	}

}

function play() {
	renderMap();
	updatePlayer();
	ready = true;
}

function keyPush(e) {
	if (ready) {
		updatePlayer();
		let player_one_id = Number.parseInt(player_one.id);

		// Left
		if (e.keyCode == 37) {
			if (!getGridClass(player_one_id-1).includes('wall-grid')) {
				resetDirection();
				left = true;
			} else {
				left = false;
				queue = 'LEFT';
			}
		}	

		// Up
		if (e.keyCode == 38) {
			if (!getGridClass(player_one_id-25).includes('wall-grid')) {
				resetDirection();
				up = true;
			} else {
				up = false;
				queue = 'UP';
			}
		}

		// Right
		if (e.keyCode == 39) {
			if (!getGridClass(player_one_id+1).includes('wall-grid')) {
				resetDirection();
				right = true;
			} else {
				right = false;
				queue = 'RIGHT';
			}
		}

		// Down
		if (e.keyCode == 40) {
			if (!getGridClass(player_one_id+25).includes('wall-grid')) {
				resetDirection();
				down = true;
			} else {
				down = false;
				queue = 'DOWN';
			}
		}
	} else {
		if (e.keyCode == 38) {
			play();
		}
	}
}

// Render the map by removing borders
function renderMap() {
	for (let i = 0; i < gs; i++) {
		let grid = getGrid(i);
		if (getGridClass(i) != 'wall-grid') {
			grid.style.border = 'none';
		}
	}
}

// Move grid from one position to another
function moveGrid(from, to) {
	let fromGrid = getGrid(from);
	let toGrid = getGrid(to);
	let type = null;

	if (getGridClass(from).includes('wall-grid')) {
		type = 'WALL';
	}
	if (getGridClass(from).includes('point-grid')) {
		type = 'POINT';
	}
	if (getGridClass(from).includes('pacman-grid')) {
		type = 'PACMAN';
	}
	
	createGrid(toGrid, type);
	deleteGrid(fromGrid);
}

// Add 0-624 IDs to grids
function addID() {
	for (let i = 0; i < gs; i++) {
		if (getGrid(i) != undefined) {
			getGrid(i).id = i;
		}		
	}
}

// Update players
function updatePlayer() {
	player_one = document.querySelector('.pacman-grid');
}

function movePlayer(dir) {
	player_one = document.querySelector('.pacman-grid');
	player_one.childNodes[0].style.transition = 'all .1s ease-in-out';	
	let player_one_id = Number.parseInt(player_one.id);
	player_one.childNodes[0].style.top = 1;	
	player_one.childNodes[0].style.right = 1;

	if (dir == 'LEFT') {
		if (!getGridClass(player_one_id-1).includes('wall-grid')) {
			// QUEUE
			if (checkQueue()) { return; }
				
			player_one.childNodes[0].style.right = Number.parseInt(player_one.childNodes[0].style.right)+24;
			setTimeout(function(){ moveGrid(player_one_id, player_one_id-1); renderMap(); updatePlayer(); }, 100);
		} else {
			movePlayer(queue);
		}
	}
	if (dir == 'UP') {
		if (!getGridClass(player_one_id-25).includes('wall-grid')) {
			// QUEUE
			if (checkQueue()) { return; }

			player_one.childNodes[0].style.top = Number.parseInt(player_one.childNodes[0].style.top)-26;
			setTimeout(function(){ moveGrid(player_one_id, player_one_id-25); renderMap(); updatePlayer(); }, 100);
		} else {
			movePlayer(queue);
		}
	}
	if (dir == 'RIGHT') {
		if (!getGridClass(player_one_id+1).includes('wall-grid')) {
			// QUEUE
			if (checkQueue()) { return; }

			player_one.childNodes[0].style.right = Number.parseInt(player_one.childNodes[0].style.right)-26;
			setTimeout(function(){ moveGrid(player_one_id, player_one_id+1); renderMap(); updatePlayer(); }, 100);
		} else {
			movePlayer(queue);
		}
	} 
	if (dir == 'DOWN') {
		if (!getGridClass(player_one_id+25).includes('wall-grid')) {
			// QUEUE
			if (checkQueue()) { return; }

			player_one.childNodes[0].style.top = Number.parseInt(player_one.childNodes[0].style.top)+24;
			setTimeout(function(){ moveGrid(player_one_id, player_one_id+25); renderMap(); updatePlayer(); }, 100);
		} else {
			movePlayer(queue);
		}
	}
	renderMap();
	updatePlayer();
}

// Reset direction of player
function resetDirection() {
	left = false;
	up = false;
	right = false;
	down = false;
}

function checkQueue() {
	let player_one_id = Number.parseInt(player_one.id);
	
	if (queue == 'LEFT') {
		if (!getGridClass(player_one_id-1).includes('wall-grid')) {
			resetDirection();
			left = true;
			queue = 'NONE';
			return true;
		}
	}
	if (queue == 'UP') {
		if (!getGridClass(player_one_id-25).includes('wall-grid')) {
			resetDirection();
			up = true;
			queue = 'NONE';
			return true;
		}
	}
	if (queue == 'RIGHT') {
		if (!getGridClass(player_one_id+1).includes('wall-grid')) {
			resetDirection();
			right = true;
			queue = 'NONE';
			return true;
		}
	}
	if (queue == 'DOWN') {
		if (!getGridClass(player_one_id+25).includes('wall-grid')) {
			resetDirection();
			down = true;
			queue = 'NONE';
			return true;
		}
	}
}

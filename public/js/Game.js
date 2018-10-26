window.onload=function() {
	document.addEventListener('keydow', keyPush);
    setInterval(game,1000/15);
}

// Variable initialization
let c = document.querySelector('#mainBoard');
c.addEventListener('mouseenter', mouseEnterEvent);
c.oncontextmenu = () => { return false; }
c.ondragstart = () => { return false; }

let buttonResetMap = document.querySelector('#button-reset-map');
let buttonLoadMap = document.querySelector('#button-load-map');
let buttonSaveMap = document.querySelector('#button-save-map');
let buttonMenu = document.querySelector('#button-menu');

buttonResetMap.addEventListener('click', resetMap);
buttonLoadMap.addEventListener('click', loadMap);
buttonSaveMap.addEventListener('click', saveMap);
//buttonMenu.addEventListener('click', menu);

// Objects
let buttonObjectWall = document.querySelector('#button-object-wall');
let buttonObjectPoint = document.querySelector('#button-object-point');

buttonObjectWall.addEventListener('click', selectObjectWall);
buttonObjectPoint.addEventListener('click', selectObjectPoint);




let gs = 625; // Grid squares
let map = [];
let saved_maps = [];
let active_object = 'WALL';

drawMap();

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

function game() {}

function keyPush() {}

function drawMap() {
	c.innerHTML = '';
	let custom_map_flag = map.length != 0;

	for (let i = 0; i < gs; i++) {
		let wall = document.createElement('div');

		if (custom_map_flag) {
			let grid = map[i];
			wall.style.background = grid.background;
			wall.style.border = grid.border;
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
}

let left_click_drag_flag = false;
let right_click_drag_flag = false;

// Create the grid on screen
function createGrid(grid, type) {
	deleteGrid(grid);
	grid.classList.remove('default-grid');
	grid.classList.remove('wall-grid');
	grid.classList.remove('point-grid');
		


	switch (type) {
		case 'WALL':
			grid.classList.add('wall-grid');
			grid.style.border = '1px solid #BEBEBE';
			grid.style.backgroundColor = '#E5E5E5';
			break;
		case 'POINT':
			let temp = document.createElement('div');
			grid.classList.add('point-grid');
			temp.style.backgroundColor = '#F8B090';
			temp.style.borderRadius = '50%';
			temp.style.padding = '10px';
			temp.style.transform = 'scale(0.2)';
			temp.style.position = 'absolute';
			grid.appendChild(temp);
			break;
	}	
	grid.addEventListener('mousedown', updateGrid);
	grid.addEventListener('mouseover', mouseOverEvent);
	grid.addEventListener('mouseup', mouseUpEvent);
}

// Delete the grid on screen
function deleteGrid(grid) {
	grid.classList.remove('wall-grid');
	grid.classList.add('default-grid');

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
	console.log(e.button);
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
function mouseEnterEvent() {
	left_click_drag_flag = false;
	right_click_drag_flag = false;
}

// Save current map
function saveMap(id, name) {
	let grid_data = [];
	let type;
	let background;
	let border;
	
	for (let i = 0; i < gs; i++) {
		if (getGridClass(i).includes('wall-grid')) {
			type = 'WALL';
		}
		if (getGridClass(i).includes('default-grid')) {
			type = 'DEFAULT'
		}

		background = getGrid(i).style.backgroundColor;
		border = getGrid(i).style.border;
		
		let data = {
			id: i,
			type: type,
			background: background,
			border: border
		}

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

// REDO with PARAMS
// Select objects from Object Selection
function selectObjectWall() {
	active_object = 'WALL';
	let e = document.getElementsByClassName('button-object');
	for (let i = 0; i < e.length; i++) {
		e[i].classList.remove('button-object-active');
	}
	this.classList.add('button-object-active');
}

function selectObjectPoint() {
	active_object = 'POINT';
	let e = document.getElementsByClassName('button-object');
	for (let i = 0; i < e.length; i++) {
		e[i].classList.remove('button-object-active');
	}
	this.classList.add('button-object-active');
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

document.addEventListener('click', hideContextMenu);
wrapper.oncontextmenu = (e) => {
	let elementCM = document.elementFromPoint(e.clientX, e.clientY); 
	if (elementCM.id == 'wrapper') {
		showContextMenu(e.clientX, e.clientY);
		return false;
	}
}
c.oncontextmenu = () => { return false; }
c.ondragstart = () => { return false; }

// Display the context menu on screen
function showContextMenu(x, y) {
	let divContextMenu = document.createElement('div');
	divContextMenu.id = 'contextMenu';
	
	let ulContextMenu = document.createElement('ul');
	let liContextMenu = null;
	for (let i = 0; i < 5; i++) {
		liContextMenu = document.createElement('li');
		liContextMenu.innerHTML = 'Function #' + (i+1);
		ulContextMenu.appendChild(liContextMenu);
	}
	divContextMenu.appendChild(ulContextMenu);
	divContextMenu.style.top = y;
	divContextMenu.style.right = Math.abs(1349-x);
	divContextMenu.style.display = 'block';
	hideContextMenu();
	wrapper.appendChild(divContextMenu);
	
}

// Hides the context menu from screen
function hideContextMenu() {
	if (document.querySelector('#contextMenu') != undefined) {
		removeElement('contextMenu');
	}
}

// Removes an element from the document
function removeElement(elementId) {
    let element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

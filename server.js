const express = require('express');
const app = express();
const fs = require('fs');

const port = 3000;
let server = app.listen(port, () => {
    console.log('Listening on port ' + port + '...');
});

app.use(express.static('public'));


// Save map data to a '.txt' file under 'public/maps/'
function saveMapData(name, data) {
    fs.writeFile('public/maps/' + name + '.txt', data);
}
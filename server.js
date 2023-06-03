const express = require('express');
const path = require('path');

// create server
const app = express();

// create directory for static ressources
app.use(express.static('public'));


// use res.sendFile() to render an html file (no ejs or other templates)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
  });

// listen on port
app.listen(3000, () => {
    console.log(`server is running on http://localhost:3000`);
});
const express = require('express');
const path = require('path');
require('dotenv').config();

// create server
const app = express();

const PORT = process.env.PORT;

// create directory for static ressources
app.use(express.static('public'));


// use res.sendFile() to render an html file (no ejs or other templates)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// listen on port
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
const express = require('express');

// Creating express object
const app = express();

// Defining port number
const PORT = process.env.PORT || 5000;
__dirname = 'public'
    // Function to serve all static files
    // inside public directory.
app.use(express.static('public'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});
// Server setup

app.listen(PORT, () => {
    console.log(`Running server on PORT ${PORT}...`);
})
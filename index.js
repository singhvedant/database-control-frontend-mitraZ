const express = require('express');

// Creating express object
const app = express();

// Defining port number
const PORT = process.env.PORT || 5000;

// Function to serve all static files
// inside public directory.
app.use(express.static('Public'));
app.use('/images', express.static('images'));

// Server setup

app.listen(PORT, () => {
    console.log(`Running server on PORT ${PORT}...`);
})
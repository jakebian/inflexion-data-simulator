
//local port to run app on
var PORT = 2000;


var express = require('express');
var app = express();

app.use(express.static('public'));

app.listen(PORT, function () {
    console.log("launched demo on port " + PORT);
});
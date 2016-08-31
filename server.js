/**
 * Created by intellective-irdi on 8/31/16.
 */

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

var api = require('./app/routes/api')(app , express);
app.use("/api",api);


/** conn to db **/
mongoose.connect(config.database, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to the database")
    }
})


//any route that u wanna go * , do shkoje gjithnje to hello world
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/views/index.html');
});
app.listen(config.port, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Listening on port 3000');
    }
});





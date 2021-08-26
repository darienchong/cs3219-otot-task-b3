// Import express
let express = require('express');
// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
// Initialize the app
let app = express();

// Import routes
let apiRoutes = require("./api-routes");
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// Connect to Mongoose and set connection variable
let mongoDbLink = 'mongodb+srv://cs3219-otot:cs3219-otot@cs3219-otot-task-b.lyitf.mongodb.net/cs3219-otot-task-b?retryWrites=true&w=majority';
mongoose.connect(mongoDbLink, { useNewUrlParser: true});

var db = mongoose.connection;

// Added check for DB connection

if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Setup server port
var port = process.env.PORT || 8080;

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));

// Use Api routes in the App
// This must come after the parser is selected
// See https://javascript.tutorialink.com/getting-typeerror-cannot-read-property-name-of-undefined-while-posting-the-form-node-js/
app.use('/api', apiRoutes);
// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});

// For testing
module.exports = app;
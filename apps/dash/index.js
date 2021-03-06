// Alexa App framework
var alexa = require('alexa-app');
var app = new alexa.app('dash');

// Use global environmental variables
var dotenv = require('dotenv').config();
// Request promise
var requestPromise = require('request-promise');

// Configuration variables
var client_uri = process.env.CLIENT_URI || "http://localhost:8080/";
var db_uri = process.env.DB_URI;

// Connection to MongoDB Altas via mongoose
var mongoose = require("mongoose");
var User = require('./models/User');

mongoose.Promise = Promise;
mongoose.connect(db_uri, {useMongoClient: true}, function(err) {
	if (err) console.log("Mongoose error: " + err);
});

// Session Manager Intents
var ConnectSession = require('./Intents/SessionManagement/ConnectSession')
var GetSession = require('./Intents/SessionManagement/GetSession')
var SetLocation = require('./Intents/SessionManagement/SetLocation')

// Launch
var Launch = require('./Intents/Launch/Launch')
var ShowApp = require('./Intents/Launch/ShowApp')

// Weather
var ChangeDay = require('./Intents/Weather/ChangeDay')

// Twenty One Intents
var ShowTwentyOne = require('./Intents/TwentyOne/ShowTwentyOne')
var DealTwentyOne = require('./Intents/TwentyOne/DealTwentyOne')
var HitTwentyOne = require('./Intents/TwentyOne/HitTwentyOne')
var StandTwentyOne = require('./Intents/TwentyOne/StandTwentyOne')


// Launch
app.launch(Launch)

// Session Management
app.intent("ConnectSessionIntent",
	{
		"slots":{"connectCode":"AMAZON.FOUR_DIGIT_NUMBER"},
		"utterances": [
			"to launch {connectCode}",
			"launch code {connectCode}"
		]
	},
	ConnectSession
)

app.intent('GetSessionIntent',
	{
		"slots": {},
		"utterances":[
			"What session am I connected to",
			"Connection status",
			"What is my connection status",
			"What animal am I connected to",
			"Session status",
			"What is my session"
		]
	},
	GetSession
)

app.intent('SetLocationIntent',
	{
		"slots": {"location":"AMAZON.AdministrativeArea"},
		"utterances":[
			"I am in {location}",
			"I am located at {location}",
			"my location is {location}",
		]
	},
	SetLocation
)
// Weather
app.intent('ShowAppIntent',
	{
		"slots": {"AppName":"AppName"},
		"utterances":[
			"to show me the {AppName}",
			"to show me {AppName}",
			"to show {AppName}",
		]
	},
	ShowApp
)

app.intent('ChangeDayIntent',
	{
		"slots": {"Day":"AMAZON.DayOfWeek"},
		"utterances": [
			"to show the forecast for {Day}",
			"to show me the weather for {Day}"
		]
	},
	ChangeDay
)

// Twenty-One
app.intent('PlayTwentyOneIntent', 
	{
		"slots": {},
		"utterances":[
			"to play twenty one",
			"to play blackjack",
			"I want to play blackjack",
			"I want to play twenty one",
		]
	},
	ShowTwentyOne
)

app.intent('DealTwentyOneIntent', 
	{
		"slots": {},
		"utterances":[
			"Deal",
			"start a new game",
			"Deal cards",
		]
	},
	DealTwentyOne
)

app.intent('HitTwentyOneIntent', 
	{
		"slots": {},
		"utterances":[
			"Hit",
		]
	},
	HitTwentyOne
)

app.intent('StandTwentyOneIntent', 
	{
		"slots": {},
		"utterances":[
			"Stand",
			"Stay",
		]
	},
	StandTwentyOne
)

app.intent("AMAZON.CancelIntent",
{
	"slots": {},
	"utterances": []
},
function(request, response) {
	response
		.say("Command cancelled.")
		.reprompt("What session would you like to connect to?")
		.shouldEndSession(false);
	}
)

app.intent("AMAZON.StopIntent",
	{
		"slots": {},
		"utterances": []
	},
	function(request, response) {
		response.say("Goodbye.").shouldEndSession(true);
	}
)

// Error handling
app.error = function(err, alexaReq, alexaRes) {
	console.log(err)
	console.log(alexaReq);
	console.log(alexaRes);	
	alexaRes.say( 'an error error has occurred: ' + err);
};

module.exports = app;


//init project
var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

require('dotenv').config();


//see Colt's course video on RESTful blog INDEX
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


var Discord = require("discord.js");
var {Client, Intents} = require("discord.js");
var bot = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
var {MessageAttachment} = require("discord.js");

var congratsArray = require("./modules/congratulations");
var facepalmArray = require("./modules/facepalm");
var triggerArray = require("./modules/triggered");

var Gif = require("./modules/gifSchema");

var taken = ["cavdance.gif", "word.gif", "cap.gif", "facepalm.gif", "hi5.gif", "triggered.gif"];

//MongoDB stuff!**************************************
var uri = process.env.DB_URL;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
 
db.once('open', function() {
    console.log("Connection Successful!");
  //closing }); is waaaay at the bottom of the page


//*************************START OF MINESWEEPER***********************************
Array.prototype.shuffle = function() {
    var input = this;

    for (var i = input.length - 1; i >= 0; i--) {

        var randomIndex = Math.floor(Math.random() * (i + 1));
        var itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}

function generateInitialArray() {
    var funcArray = []
    for (var i = 0; i < 64; i++) {
        if (i < 10) {
            funcArray.push("||:bomb:||");
        } else {
            funcArray.push("safe");
        }
    }
    return funcArray;
}



//this function should accept firstArray as an argument
function createGameArray(arr) {
    var funcArray = []
    for (var i = 0; i < 8; i++) {
        var tempArray = arr.splice(0, 8);
        funcArray.push(tempArray);
    }
    return funcArray;
}


function prepareGameArray(arr) {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var counter = 0;
            if (arr[i][j] == "safe") {
                for (var k = -1; k <= 1; k++) {
                    for (var l = -1; l <= 1; l++) {
                        if (arr[i + k]) {
                            if (arr[i + k][j + l] == "||:bomb:||") {
                                counter++;
                            }
                        }
                    }
                }
                arr[i][j] = counter;
            }
        }
    }
}

function gameArrayToEmoji(arr) {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            switch (arr[i][j]) {
                case 1:
                    arr[i][j] = "||:one:||";
                    break;
                case 2:
                    arr[i][j] = "||:two:||";
                    break;
                case 3:
                    arr[i][j] = "||:three:||";
                    break;
                case 4:
                    arr[i][j] = "||:four:||";
                    break;
                case 5:
                    arr[i][j] = "||:five:||";
                    break;
                case 6:
                    arr[i][j] = "||:six:||";
                    break;
                case 7:
                    arr[i][j] = "||:seven:||";
                    break;
                case 8:
                    arr[i][j] = "||:eight:||";
                    break;
                case 0:
                    arr[i][j] = "||:white_large_square:||";
                    break;
            }
        }
    }
}
//***************END OF MINESWEEPER***************************





// The following items are for cycling through the various arrays
function cycle(i, array) {
    i = i % array.length + 1;
    return i;
}

var congratCounter = 1;
var congratInterval = setInterval(congratCycle, 30000);
var triggerCounter = 1;

function congratCycle() {
    congratCounter = (congratCounter % congratsArray.length + 1);
}

app.get("/", (req, res) => {
    return res.send("Hello!");
});

//Route for GifList page
app.get("/gifList", function(req, res){
  Gif.find({}, function(err, gifs){
    if(err){
      console.log("Error in the gifList route!");
    } else {
      res.render("gifList", {gifs:gifs.sort((a, b) => (a.call > b.call) ? 1 : -1)});
    }
  });
});

bot.on('ready', () => {
    console.log('Ready to roll!');
});

bot.on("messageCreate", message => {
     //This line makes it so the bot can't call itself
    if (message.author.discriminator !== "4751") {
        //Cavan Dance
        if (message.content.toLowerCase().includes("cavdance.gif")) {
            var cavGif = "https://cdn.glitch.com/08e88dba-4367-4844-909a-786d085467a9%2FCavan.gif";
            message.channel.send(cavGif);
            console.log("He can dance if he wants to!");
            console.log(typeof message.author.discriminator);
        }

        //Congratulations!
        if (message.content.toLowerCase().includes("congratulations!")) {
            var congratGif = congratsArray[congratCounter - 1];
            message.channel.send(congratGif);
            console.log("We're so proud!");
            congratCounter = cycle(congratCounter, congratsArray);
            console.log(congratCounter);
        }
    
        //Dab  
        if (message.content.toLowerCase() === "!dab") {
            var dabImage = "https://cdn.discordapp.com/attachments/456875845483757570/619267446322364426/1929402_1005494306791_3146_n.png";
            message.channel.send(dabImage);
            console.log("ヽ( •_•)ᕗ");
        }
        
        //Echo
        if (message.content.toLowerCase().slice(0,5) === "echo ") {
            message.channel.send(message.content.slice(5));
            console.log("Echo!");
            console.log("author id: " + message.author.discriminator);
        }

        //facepalm.gif
        if (message.content.toLowerCase() === "facepalm.gif") {
            var facepalmGif = facepalmArray[Math.floor(Math.random() * facepalmArray.length)];
            message.channel.send(facepalmGif);
            console.log("Ugh...");
        }

        //Happy birthday
        if (message.content.toLowerCase().includes("happy birthday!")) {
            console.log("I didn't know it was your birthday!");
                switch (message.author.discriminator) {
                    case "5760": //Steve
                        message.channel.send("https://www.youtube.com/watch?v=v-0xugvRnUg");
                        break;

                    case "0216": //Kiffen
                        message.channel.send("https://www.youtube.com/watch?v=8zgz2xBrvVQ");
                        break;

                    case "2682": //Sean
                        message.channel.send("https://www.youtube.com/watch?v=pCR9aI0jvuA");
                        break;

                    case "8015": //Tom
                        message.channel.send("https://www.youtube.com/watch?v=7u4pVvhqI-s");
                            //formerly https://www.nbc.com/saturday-night-live/video/happy-birthday/2860793
                            //or https://www.dailymotion.com/video/xir8t6
                        break;

                    case "8032": //Clarissa
                        message.channel.send("https://giphy.com/gifs/birthday-happy-birthday-cake-forever-yung-xT0BKqhdlKCxCNsVTq");
                        break;
                
                    case "7084": //Roz
                        message.channel.send("https://www.youtube.com/watch?v=6t1vaF50Ks0");
                        break;

                    case "5985": //Dennis
                        message.channel.send("https://www.youtube.com/watch?v=NkoRl5CZhF8");
                        break;

                    case "9070": //Todd
                        message.channel.send("Chocolate boxes");
                        break;

                    case "7947": //Kayla
                        message.channel.send("https://youtu.be/S-LRITaHUbI");
                        break;

                    case "6092": //Angela
                        message.channel.send("https://www.youtube.com/watch?v=kcA2M3Az6Us&t=33s");
                        break;

                    case "5657": //Emmerin
                        message.channel.send("https://youtu.be/UYE834sgtSs");
                        break;

                    case "4751": //Response Bot
                        break;

                    default:
                        message.channel.send("Looks like you don't yet have a custom birthday message. Let Steve know what you'd like to send and he'll get it set up.");
                }
        }

        //High Five
        if (message.content.toLowerCase() === "hi5.gif" || message.content.toLowerCase().includes("janet, hi5") || message.content.toLowerCase().includes("janet, high five")) {
            var pic = "https://66.media.tumblr.com/f9aa4cf7be5072dd8dfd4ce73597a474/tumblr_oyee7p3N351wtl4k2o2_250.gif";
            message.channel.send(pic).then(
            setTimeout(function () {
              message.channel.send("hi5");
              }, 4000)
            );
            console.log("Thanks, babe.");
        }

        //Kill all the poor
        if(message.content.toLowerCase().includes("kill all the poor") || message.content.toLowerCase().includes("kill the poor") 
        || message.content.toLowerCase().includes("killing all the poor") || message.content.toLowerCase().includes("killing the poor")){
            var killThePoorArray = [
                "With respect, we've had this conversation before...",
                "I'm not saying _do_ it; I'm just saying run it through the computer, see if it would work.",
                "So you think it _might_ work?",
                "We need them for all the things that we don't fancy.",
                "Are you thinking of immigrants?",
                "I can't believe you haven't done it drunk as a joke.",
                "Have you tried raise VAT and kill all the poor?",
                "The computer says it wouldn't help, so we're not doing it!",
                "Bloody hell, now _I'm_ offended!",
                "It's morally wrong, _" + message.author.username + "_.",
                "Shave half a percent off interest rates, shore up the pound, keep VAT steady for now, and round up all the dwarfs."
            ];
            message.channel.send(killThePoorArray[Math.floor(Math.random()*killThePoorArray.length)]);
            console.log("https://www.youtube.com/watch?v=owI7DOeO_yg");
        }

        //Language!
        if ((message.content.toLowerCase().includes("damn") || message.content.toLowerCase().includes("dammit") || message.content.toLowerCase().includes("cap.gif")) && message.content.toLowerCase() !== "damnright.gif" && message.channel.name !== "the-therapy-couch") {
            var captain = "https://cdn.glitch.com/08e88dba-4367-4844-909a-786d085467a9%2Ftenor.gif";
            message.channel.send(captain);
            console.log("You got it, Cap.");
        }
  
        //Leap of Faith
        if (message.content.toLowerCase().includes("leap of faith")) {
            message.channel.send("It's better translated as a leap into faith.");
            console.log("Kirkegaard, baby!");
        }
      
        //Link?
        if (message.content.toLowerCase() === "link?") {
            var linkPicture = "https://vignette.wikia.nocookie.net/joke-battles/images/8/8b/Link4.png";
            message.channel.send(linkPicture);
            console.log("Here you go!");
            console.log(typeof message.author.discriminator);
        }

        //Minesweeper
        if (message.content.toLowerCase() === "minesweeper") {
            var firstArray = generateInitialArray()
            firstArray.shuffle();
            var gameArray = createGameArray(firstArray);
            prepareGameArray(gameArray);
            gameArrayToEmoji(gameArray);
            var block = "Good luck!\n"
            for (var i = 0; i < 8; i++) {
                var row = ""
                for (var j = 0; j < 8; j++) {
                    row += gameArray[i][j] + " ";
                }
                row += "\n"
                block += row
            }
            message.channel.send(block);
            console.log("New game of minesweeper!");
          }

        //Nerds!
        if (message.content.toLowerCase() === "nerds!") {
            var nerds = "https://media.giphy.com/media/A9KfKenpqNDfa/giphy.gif"; 
            message.channel.send(nerds);
            console.log("Freaking nerds.");
        }

        //Ron
        if (message.content.toLowerCase().slice(0,4) === "ron:") {
            message.channel.send("Ron Howard:" + message.content.slice(4));
            message.delete({options: {timeout: 100000}});
            console.log("It was Arrested Development.");
            console.log("author id: " + message.author.discriminator);
        }

        //Sean!
        if (message.content.toLowerCase() === "sean!") {
            var seanPicture = "https://cdn.glitch.com/08e88dba-4367-4844-909a-786d085467a9%2Fsean2.gif";
            message.channel.send(seanPicture);
            console.log("Dangit, Sean!");
            console.log(typeof message.author.discriminator);
        }
      
        //Shrug
        if (message.content.includes("¯\\_(ツ)_/¯")){
          setTimeout(function(){
            message.channel.send("¯\\_(ツ)_/¯");
            console.log("¯\\_(ツ)_/¯");
          }, 1000);  //wait 1000 ms before responding
        }      
        
        //Sound
        if (message.content.toLowerCase().includes("new record") || message.content.toLowerCase().includes("new lap record")) {
            var sound = "https://cdn.discordapp.com/attachments/550428943501623298/776528304743776266/it_s_a_new_lap_record_-3498164912892836578_1.mp3";
            message.channel.send({
                files: [{
                    attachment: sound
                }]
            });
            console.log("It's a new lap record!");
        }
      

        //Triggered
        if (message.content.toLowerCase() === "triggered.gif") {
            var triggeredGif = triggerArray[triggerCounter - 1];
            message.channel.send(triggeredGif);
            console.log("You didn't even warn me!");
            triggerCounter = cycle(triggerCounter, triggerArray);
            console.log(triggerCounter);
        }

        //Word!
        if (message.content.toLowerCase() === "word.gif") {
            var chapelle = "https://cdn.glitch.com/08e88dba-4367-4844-909a-786d085467a9%2Fchapelle.gif";
            message.channel.send(chapelle);
            console.log("Word!");
        }


        
//******************START OF DATABASE************************
var createExpression = new RegExp("newGif [a-zA-Z0-9._\-]+\.gif https?[^ ]+\.gif", "i");


if (createExpression.test(message.content)){
	var array = message.content.split(" "),
		command = array[0], call = array[1].toLowerCase(), url = array[2];
  Gif.findOne({call: call}, function(err, result){
    if(err){
      console.log(err);
      return err;
    } else if(result !== null || taken.includes(call)){
      message.channel.send("That name is taken. Please choose a new one.");
      return result;
    } else {
      Gif.create({call:call, url:url, creator:message.author.username});
      message.channel.send("Success! Use " + call + " to call your gif.");
      console.log(message.author.username + " just added a new gif to the database.");
    }
  });
}
  
var callExpression = new RegExp("[^ ]+.gif", "i");
if (callExpression.test(message.content)){
  Gif.findOne({call: message.content.toLowerCase()}, function(err, result){
    if (err){
      console.log(err);
      return err;
  } else if (!result){
      return result;
  } else {
      var foundGif = new MessageAttachment(result.url);
      if (result.url.slice(-1).toLowerCase()==="v"){
        message.channel.send(result.url);
        console.log("That gifv came from a database. Steve is so cool!");
      } else {
        //the .then() function takes two arguments - a success case and a failure case. Here, if there's a success, we want to do nothing.
        message.channel.send(foundGif).then(null, function(){message.channel.send(result.url)});
        console.log("That gif came from a database. Steve is so cool!");
      }
    }
  });
}
      
if (message.content.toLowerCase() == "giflist"){
  message.channel.send("<https://docs.google.com/spreadsheets/d/1qbsULha1vF6fX4NtEAWd16hPfmmqCsFqKv4yLXP4yek/edit?usp=sharing>");
      //This is what gifList USED to do.
      // Gif.find({}, function(err, gifs){
      //   var objectList = Object.values(gifs);
      //   console.log(objectList);
      //   var gifList = [];
      //   for(var i = 0; i < objectList.length; i++){
      //     gifList[i] = objectList[i].call;
      //   }
      //   message.channel.send(gifList.sort());
      // });
  }
      



//******************END OF DATABASE************************    

        //This one contains the index
        if (message.content.toLowerCase() === "janet" || message.content.toLowerCase() === "response bot") {
            var responses = "Hi, I'm Janet! \ncap.gif \ncavdance.gif \nCongratulations! \n!dab \necho [text] \nfacepalm.gif " +
            "\ngifList \nHappy Birthday! \n hi5.gif \nLink? \nMinesweeper \nNerds! \nRon: [text] \nSean! \ntriggered.gif \nword.gif \n!y";
            message.channel.send(responses);
            console.log("Glad I could help.");
        }
    }
});

bot.login(process.env.BOT_TOKEN, () => {
    console.log("Logged in!");
});


// //This block of code is to continually ping the server to keep the site awake (didn't work)
// var http = require('http');

// function startKeepAlive() {
//     setInterval(function(){
//         var options={
//             host: "discord-janet.herokuapp.com",
//             port: process.env.PORT,
//             path: '/'
//         };
//         http.get(options, function(res) {
//             res.on('data', function(chunk){
//                 try{
//                     console.log("HEROKU RESPONSE: " + chunk);
//                 } catch (err) {
//                     console.log(err.message);
//                 }
//             });
//         }).on('error', function(err){
//             console.log("Error: " + err.message);
//         });
//     }, 19 * 60 * 1000); //load every 19 minutes
// }
// startKeepAlive();

app.listen(process.env.PORT);



//https://www.youtube.com/watch?v=9CDPw1lCkJ8
//https://anidiotsguide_old.gitbooks.io/discord-js-bot-guide/content/other-guides/hosting-on-glitchcom.html
//https://dzone.com/articles/happy-apps-how-to-prevent-a-heroku-dyno-from-idlin#:~:text=When%20one%20of%20your%20Heroku,by%20running%20a%20custom%20function.
  
  
}); //this closes the db.once function
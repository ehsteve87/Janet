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
var bot = new Discord.Client();
var {Client} = require("discord.js");
var {MessageAttachment} = require("discord.js");

var congratsArray = require("./modules/congratulations");
var facepalmArray = require("./modules/facepalm");

var Gif = require("./modules/gifSchema");

var taken = ["cavdance.gif", "word.gif", "cap.gif", "punch.gif", "facepalm.gif", "hi5.gif"];

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

bot.on("message", message => {
     //This line makes it so the bot can't call itself
    if (message.author.discriminator !== "4751") {
        //Congratulations!
        if (message.content.toLowerCase().includes("congratulations!")) {
            var congratGif = new MessageAttachment(congratsArray[congratCounter - 1]);
            message.channel.send(congratGif);
            console.log("We're so proud!");
            congratCounter = cycle(congratCounter, congratsArray);
            console.log(congratCounter);
        }
      
        //Cavan Dance
        if (message.content.toLowerCase().includes("cavdance.gif")) {
            var cavGif = new MessageAttachment("https://cdn.glitch.com/08e88dba-4367-4844-909a-786d085467a9%2FCavan.gif");
            message.channel.send(cavGif);
            console.log("He can dance if he wants to!");
            console.log(typeof message.author.discriminator);
        }
    
        //Dab  
        if (message.content.toLowerCase() === "!dab") {
            var dabImage = new MessageAttachment("https://cdn.discordapp.com/attachments/456875845483757570/619267446322364426/1929402_1005494306791_3146_n.png");
            message.channel.send(dabImage);
            console.log("ヽ( •_•)ᕗ");
        }
      
        //facepalm.gif
        if (message.content.toLowerCase() === "facepalm.gif") {
            var facepalmGif = new MessageAttachment(facepalmArray[Math.floor(Math.random() * facepalmArray.length)]);
            message.channel.send(facepalmGif);
            console.log("Ugh...");
        }

        //Sean!
        if (message.content.toLowerCase() === "sean!") {
            var seanPicture = new MessageAttachment("https://cdn.glitch.com/08e88dba-4367-4844-909a-786d085467a9%2Fsean2.gif");
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
        
        //Echo
        if (message.content.toLowerCase().slice(0,5) === "echo ") {
            message.channel.send(message.content.slice(5));
            console.log("Echo!");
            console.log("author id: " + message.author.discriminator);
        }
        //High Five
        if (message.content.toLowerCase() === "hi5.gif") {
            var pic = new MessageAttachment("https://66.media.tumblr.com/f9aa4cf7be5072dd8dfd4ce73597a474/tumblr_oyee7p3N351wtl4k2o2_250.gif");
            message.channel.send(pic).then(
            setTimeout(function () {
              message.channel.send("hi5");
              }, 4000)
            );
            console.log("Thanks, babe.");
        }
      
        //Ron
        // if (message.content.toLowerCase().slice(0,4) === "ron:") {
        //     message.channel.send("Ron Howard:" + message.content.slice(4));
        //     message.delete({options: {timeout: 30000}});
        //     console.log("It was Arrested Development.");
        //     console.log("author id: " + message.author.discriminator);
        // }
  
        //Leap of Faith
        if (message.content.toLowerCase().includes("leap of faith")) {
            var cavGif = new MessageAttachment("https://cdn.glitch.com/08e88dba-4367-4844-909a-786d085467a9%2FCavan.gif");
            message.channel.send("It's better translated as a leap into faith.");
            console.log("Kirkegaard, baby!");
        }
      
        //Link?
        if (message.content.toLowerCase() === "link?") {
            var linkPicture = new MessageAttachment("https://vignette.wikia.nocookie.net/joke-battles/images/8/8b/Link4.png");
            message.channel.send(linkPicture);
            console.log("Here you go!");
            console.log(typeof message.author.discriminator);
        }

        //Punch!  
        if (message.content.toLowerCase() === "punch.gif") {
            var seanPicture = new MessageAttachment("https://cdn.glitch.com/08e88dba-4367-4844-909a-786d085467a9%2Fmarvelpunch.gif");
            message.channel.send(seanPicture);
            console.log("Right in the kisser");
        }
      
        //TEST**TEST**TEST
        //This shows how to get a user object from the Cool People guild. 
        if (message.content.toLowerCase() === "authortest") {
            message.channel.send(bot.guilds.get('456875845483757568').members.get(message.author).toString());
            console.log(bot.guilds.get('456875845483757568').members.get(message.author));
        }
      
        //Trump (temporary)  
        if (message.content.toLowerCase().includes("trump")) {
            var gif = new MessageAttachment("https://thumbs.gfycat.com/SmoggyHilariousBaiji-size_restricted.gif");
            message.channel.send(gif);
            console.log("Should we bow? Yeah, he's a king.");
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
                var nerds = new MessageAttachment("https://media.giphy.com/media/A9KfKenpqNDfa/giphy.gif"); //https://media.giphy.com/media/A9KfKenpqNDfa/giphy.gif  <-this is the real gif
                message.channel.send(nerds);
                console.log("Freaking nerds.");
            }

            //Language!
            if ((message.content.toLowerCase().includes("damn") || message.content.toLowerCase().includes("dammit") || message.content.toLowerCase().includes("cap.gif")) && message.content.toLowerCase() !== "damnright.gif") {
                var captain = new MessageAttachment("https://cdn.glitch.com/08e88dba-4367-4844-909a-786d085467a9%2Ftenor.gif");
                message.channel.send(captain);
                console.log("You got it, Cap.");
            }
      
            //Fire Thumbs Up
            if (message.content.toLowerCase() === "!y"){
                var thumb = new MessageAttachment("https://media.tenor.com/images/1cf02a0b665a45fc94d4184ebda9cb11/tenor.gif");
                message.channel.send(thumb);
                console.log("Hasta la vista, baby");
            }
            //Word!
            if (message.content.toLowerCase() === "word.gif") {
                var chapelle = new MessageAttachment("https://cdn.glitch.com/08e88dba-4367-4844-909a-786d085467a9%2Fchapelle.gif");
                message.channel.send(chapelle);
                console.log("Word!");
            }

            //Happy birthday
            if (message.content.toLowerCase().includes("happy birthday!")) {
                console.log("I didn't know it was your birthday!");
                 switch (message.author.discriminator) {
                     case "5760": //Steve
                         message.channel.send("https://www.youtube.com/watch?v=oYjuD-_yh2g");
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

                     case "4751": //Response Bot
                         break;

                     default:
                         message.channel.send("Looks like you don't yet have a custom birthday message. Let Steve know what you'd like to send and he'll get it set up.");
                 }
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
  message.channel.send("http://discord-janet.herokuapp.com/giflist");
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
            var responses = "Hi, I'm Janet! \ncap.gif \ncavdance.gif \nCongratulations! \n!dab \necho [text] \nfacepalm.gif \ngifList \nHappy Birthday! \n hi5.gif \nLink? \nMinesweeper \nNerds! \npunch.gif \nRon: [text] \nSean! \nword.gif \n!y";
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
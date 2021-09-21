# Installations
```
npm i discord-rock-paper-scissor
```

# What?
This package is created for making Rock Paper Scissor game for discord bots with rich features like Message Components.

# Why?
This package is very easy to use and you can request new updates and stuff simple by messaging me on my [discord server](https://discord.gg/XYnMTQNTFh)

# How?
## Basic
```js
const RPS = require('discord-rock-paper-scissor');
const rps = new RPS();

/**
 * This method will start a Solo game between The message author and bot, everything is automatic <3
 * @param {Discord.Message} message The message object where command was used
 * @param {Discord.Client} bot Your client object
 */
rps.solo(message,bot);

/**
 * This method will start a Duo game between The message author and Player 2, everything is automatic <3
 * @param {Discord.Message} message The message object where command was used
 * @param {Discord.User} player2 The mentioned User / second player. Note it should be a discord user Object not guild member object
 */
rps.duo(message,player2);
```

## Advanced
```js
const RPS = require('../../../../packages/discord-rock-paper-scissor/src');
const rps = new RPS({
    choiceReply: "You chose {move}",
    endTitle: "Game ended very very victoriously for {winner}",
    readyMessage: "Choose the dang moves kiddos",
    drawEndTitle: "Bruh nerds ended up getting a draw",
    choiceTitle: "Choose the move boiiiiiiiiiiiiiiiii",
    choiceDescription: "I  hope that you can read than click on buttons to choose the move",
    drawEndDescription: "{player1} chose : {player1move}\n\n{player2} chose : {player2move}\nStupid nerds arent they",
    endDescription: "[Winner 👑] {winner}'s move : {winnermove}\n\n[Looser 🤮] {looser}'s move : {loosermove}"
});

/**
 * This method will start a Solo game between The message author and bot, everything is automatic <3
 * @param {Discord.Message} message The message object where command was used
 * @param {Discord.Client} bot Your client object
 */
rps.solo(message,bot);

/**
 * This method will start a Duo game between The message author and Player 2, everything is automatic <3
 * @param {Discord.Message} message The message object where command was used
 * @param {Discord.User} player2 The mentioned User / second player. Note it should be a discord user Object not guild member object
 */
rps.duo(message,player2);
```

# Example Images
## The Game
![game.png](https://cdn.discordapp.com/attachments/880732844220100608/880744256258588733/unknown.png)

## Game ending
![gameend.png](https://cdn.discordapp.com/attachments/880732844220100608/880744307454259240/unknown.png)

## Game Private for DUO Mode
In duo mode both users have to choose in DM
![gamerequest.png](https://cdn.discordapp.com/attachments/880732844220100608/880744362424803328/unknown.png)

# Support
If you need any help or something you can get support on my [discord server](https://discord.gg/XYnMTQNTFh)
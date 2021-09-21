const Discord = require('discord.js'), { getChoice, getEmoji } = require('./utility');

class rps {
    /**
     * 
     * @param {Object} options The options for rock paper scissors
     * @param {String} options.readyMessage message to send while bot is waiting for users to choose their move.
     * @param {String} options.choiceTitle The title for embed sent in DM to get user's move.
     * @param {String} options.choiceDescription The description for embed sent in DM to get user's move.
     * @param {String} options.choiceReply The reply to the user after choosing process is finished.
     * @param {String} options.drawEndTitle The title for embed sent if game is ended as an draw.
     * @param {String} options.drawEndDescription The description for embed sent if game is ended as an draw.
     * @param {String} options.endTitle The title for embed sent if game is not an draw.
     * @param {String} options.endDescription The description for embed sent if game is not an draw.
     */
    constructor(options = {}) {
        this.readyMessage = options.readyMessage || "Choose your moves in DM";
        this.choiceTitle = options.choiceTitle || "Rock Paper Scissor";
        this.choiceDescription = options.choiceDescription || "Choose your move by clicking on the buttons";
        this.choiceReply = options.choiceReply || "Nerd chose {move}";
        this.drawEndTitle = options.drawEndTitle || "Game ended with an draw 😞";
        this.drawEndDescription = options.drawEndDescription || "{player1} chose : {player1move}\n\n{player2} chose : {player2move}";
        this.endTitle = options.endTitle || "Game ended victoriously for {winner}"
        this.endDescription = options.endDescription || "{winner} [ Winner 👑 ] chose : {winnermove}\n\n{looser} [ Looser 👑 ] chose : {loosermove}\n\n"
    }

    /**
     * The solo mode for rock paper scissor. User VS Bot
     * @param {Discord.Message} message The messae object in which command was used
     * @param {Discord.Client} bot The client object
     */
    async solo(message, bot) {
        console.log(this);
        getChoice.bind(this)(message.author, message.channel).then(v => {

            const userChoice = v.choice;
            const sent = v.message;
            const choice = getEmoji(Math.floor(Math.random() * 3) + 1);

            let row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId("y7ghjuiojioujoj").setDisabled(true).setStyle("SUCCESS").setEmoji("🕊").setLabel("Game Ended"))

            if (userChoice === choice) { // draw
                sent.edit({ embeds: [{ color: "DARK_BUT_NOT_BLACK", title: this.drawEndTitle, description: this.drawEndDescription.replace(/{player1}/g, message.author.username).replace(/{player1move}/g, userChoice).replace(/{player2}/g, bot.user.username || "Bot").replace(/{player2move}/g, choice) }], components: [row] });
            } else if ((userChoice === "✊" && choice === "✌️") || (userChoice === "🤚" && choice === "✊") || (userChoice === "✌️" && choice === "🤚")) { // user win
                sent.edit({ embeds: [{ color: "GREEN", title: this.endTitle.replace(/{winner}/g, message.author.username).replace(/{looser}/g, bot.user.username), description: this.endDescription.replace(/{winner}/g, message.author.username).replace(/{winnermove}/g, userChoice).replace(/{looser}/g, bot.user.username || "Bot").replace(/{loosermove}/g, choice) }], components: [row] });
            } else { // User loose
                sent.edit({ embeds: [{ color: "GREEN", title: this.endTitle.replace(/{looser}/g, message.author.username).replace(/{winner}/g, bot.user.username), description: this.endDescription.replace(/{looser}/g, message.author.username).replace(/{loosermove}/g, userChoice).replace(/{winner}/g, bot.user.username || "Bot").replace(/{winnermove}/g, choice) }], components: [row] });
            }
        }).catch(e => {
            if (e.username) {
                message.reply(`I was unable to DM ${e.username}`);
            } else {
                message.reply("There was a error in executing the command");
                console.log(`[discord-rock-paper-scissor] : Error in Solo mode : `);
                console.log(e);
            }
        })
    }

    /**
     * The dyo mode for rock paper scissor. User VS Bot
     * @param {Discord.Message} message The messae object in which command was used
     * @param {Discord.User} player2 The Second Player's Discord User Object
     */
    async duo(message, player2) {
        if (!message || !message.author) throw new Error("Invalid Message Object");
        if (!player2 || !player2.username) throw new Error("Invalid Player 2 Object");

        const player1 = message.author;
        const sent = await message.channel.send({ embeds: [{ color: "ORANGE", title: this.readyMessage }] });
        let no = false;

        let player1Choice = "";
        await message.channel.send({ content: `${player1.toString()}`, reply: { messageReference: sent.id } });
        await getChoice.bind(this)(player1, await player1.createDM()).then(v => player1Choice = v.choice).catch(e => no = e.username)
        let player2Choice = "";
        await message.channel.send({ content: `${player2.toString()}`, reply: { messageReference: sent.id } });
        await getChoice.bind(this)(player2, await player2.createDM()).then(v => player2Choice = v.choice).catch(e => no = e.username);

        if (no !== false) return sent.edit({ components: [], embeds: [{ color: "RED", title: `I was unaable to DM ${no}, so please open DM than try again.` }] })

        let row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId("y7ghjuiojioujoj").setDisabled(true).setStyle("SUCCESS").setEmoji("🕊").setLabel("Game Ended"))

        if (player1Choice === player2Choice) { // draw
            sent.edit({ embeds: [{ color: "DARK_BUT_NOT_BLACK", title: this.drawEndTitle, description: this.drawEndDescription.replace(/{player1}/g, message.author.username).replace(/{player1move}/g, player1Choice).replace(/{player2}/g, player2.username).replace(/{player2move}/g, player2Choice) }], components: [row] });
        } else if ((player1Choice === "✊" && player2Choice === "✌️") || (player1Choice === "🤚" && player2Choice === "✊") || (player1Choice === "✌️" && player2Choice === "🤚")) { // player 1 won
            sent.edit({ embeds: [{ color: "GREEN", title: this.endTitle.replace(/{winner}/g, message.author.username).replace(/{looser}/g, player2.username), description: this.endDescription.replace(/{winner}/g, message.author.username).replace(/{winnermove}/g, player1Choice).replace(/{looser}/g, player2.username || "Bot").replace(/{loosermove}/g, player2Choice) }], components: [row] });
        } else { // player 2 won
            sent.edit({ embeds: [{ color: "GREEN", title: this.endTitle.replace(/{looser}/g, message.author.username).replace(/{winner}/g, player2.username), description: this.endDescription.replace(/{looser}/g, message.author.username).replace(/{loosermove}/g, player1Choice).replace(/{winner}/g, player2.username || "Bot").replace(/{winnermove}/g, player2Choice) }], components: [row] });
        }
    }
}

module.exports = rps;
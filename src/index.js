const Discord = require('discord.js'), { getChoice, getEmoji } = require('./utility');

class rps {
    /**
     * The solo mode for rock paper scissor. User VS Bot
     * @param {Discord.Message} message The messae object in which command was used
     * @param {Discord.Client} bot The client object
     */
    async solo(message, bot) {
        const db = await getChoice(message.author, message.channel);
        const userChoice = db.choice;
        const sent = db.message;
        const choice = getEmoji(Math.floor(Math.random() * 3) + 1);

        let row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId("y7ghjuiojioujoj").setDisabled(true).setStyle("SUCCESS").setEmoji("🕊").setLabel("Game Ended"))

        if (userChoice === choice) { // draw
            sent.edit({ embeds: [{ color: "DARK_BUT_NOT_BLACK", title: "Game ended with an Draw", description: `${message.author.username} chose : ${userChoice}\n\n${message.guild.me.nickname || bot.user.username} chose : ${choice}` }], components: [row] });
        } else if ((userChoice === "✊" && choice === "✌️") || (userChoice === "🤚" && choice === "✊") || (userChoice === "✌️" && choice === "🤚")) { // user win
            sent.edit({ embeds: [{ color: "GREEN", title: `The game ended victoriously for ${message.author.username}`, description: `${message.author.username} [ Winner 👑 ] chose : ${userChoice}\n\n${message.guild.me.nickname || bot.user.username} [ Looser 🤢 ] chose : ${choice}` }], components: [row] });
        } else { // User loose
            sent.edit({ embeds: [{ color: "GREEN", title: `${message.author.username} was defeated`, description: `${message.author.username} [ Looser 🤢 ] chose : ${userChoice}\n\n${message.guild.me.nickname || bot.user.username} [ Winner 👑 ] chose : ${choice}` }], components: [row] });
        }
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
        const sent = await message.channel.send({ embeds: [{ color: "ORANGE", title: "Check your DM to play RPS game" }] });
        let no = false;

        let player1Choice = "";
        await message.channel.send({ content: `${player1.toString()}`, reply: { messageReference: sent.id } });
        await getChoice(player1, await player1.createDM()).then(v => player1Choice = v.choice).catch(e => no = e.username)
        let player2Choice = "";
        await message.channel.send({ content: `${player2.toString()}`, reply: { messageReference: sent.id } });
        await getChoice(player2, await player2.createDM()).then(v => player2Choice = v.choice).catch(e => no = e.username);

        if (no !== false) return sent.edit({ components: [], embeds: [{ color: "RED", title: `I was unaable to DM ${no}, so please open DM than try again.` }] })

        let row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId("y7ghjuiojioujoj").setDisabled(true).setStyle("SUCCESS").setEmoji("🕊").setLabel("Game Ended"))

        if (player1Choice === player2Choice) { // draw
            sent.edit({ embeds: [{ color: "DARK_BUT_NOT_BLACK", title: "Game ended with an Draw", description: `${player1.username} chose : ${player1Choice}\n\n${player2.username} chose : ${player2Choice}` }], components: [row] });
        } else if ((player1Choice === "✊" && player2Choice === "✌️") || (player1Choice === "🤚" && player2Choice === "✊") || (player1Choice === "✌️" && player2Choice === "🤚")) { // player 1 won
            sent.edit({ embeds: [{ color: "GREEN", title: `The game ended victoriously for ${player1.username}`, description: `${player1.username} [ Winner 👑 ] chose : ${player1Choice}\n\n${player2.username} [ Looser 🤢 ] chose : ${player2Choice}` }], components: [row] });
        } else { // player 2 won
            sent.edit({ embeds: [{ color: "GREEN", title: `${player1.username} was defeated`, description: `${player1.username} [ Looser 🤢 ] chose : ${player1Choice}\n\n${player2.username} [ Winner 👑 ] chose : ${player2Choice}` }], components: [row] });
        }
    }
}

module.exports = new rps();
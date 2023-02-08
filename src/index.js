const Discord = require('discord.js'),
    { getChoice, getChoices, getEmoji } = require('./utility'),
    color = require('./classes/color');

class rps {
    /**
     * 
     * @param {Object} options The options for rock paper scissors
     * @param {"dm" | "channel"} options.chooseIn Where should the bot message to ask for user's choice.
     * @param {String} options.readyMessage message to send while bot is waiting for users to choose their move.
     * @param {String} options.choiceTitle The title for embed sent in DM to get user's move.
     * @param {String} options.choiceDescription The description for embed sent in DM to get user's move.
     * @param {Boolean} options.replyChoice Whether the bot should send a reply for choosing a move or not
     * @param {String} options.choiceReply The reply to the user after choosing process is finished.
     * @param {String} options.drawEndTitle The title for embed sent if game is ended as an draw.
     * @param {String} options.drawEndDescription The description for embed sent if game is ended as an draw.
     * @param {String} options.endTitle The title for embed sent if game is not an draw.
     * @param {String} options.endDescription The description for embed sent if game is not an draw.
     * @param {Colors} options.colors The colors for the embeds.
     * @param {Boolean} options.endReply Whether the bot should send a reply for game ends
     */
    constructor(options = {}) {
        this.colors = new color(options.colors);
        this.chooseIn = options.chooseIn || "dm";
        this.readyMessage = options.readyMessage || "Choose your moves in DM";
        this.choiceTitle = options.choiceTitle || "Rock Paper Scissor";
        this.choiceDescription = options.choiceDescription || "Choose your move by clicking on the buttons";
        this.choiceReply = options.choiceReply || "Nerd chose {move}";
        this.drawEndTitle = options.drawEndTitle || "Game ended with an draw 😞";
        this.drawEndDescription = options.drawEndDescription || "{player1} chose : {player1move}\n\n{player2} chose : {player2move}";
        this.endTitle = options.endTitle || "Game ended victoriously for {winner}"
        this.endDescription = options.endDescription || "{winner} [ Winner 👑 ] chose : {winnermove}\n\n{looser} [ Looser 👑 ] chose : {loosermove}\n\n"
        this.replyChoice = typeof options.replyChoice === 'boolean' ? options.replyChoice : true;
        this.endReply = typeof options.endReply === 'boolean' ? options.endReply : true;

        if (this.chooseIn !== "dm" && this.chooseIn !== "channel") throw new Error("Choose in property should be either \"dm\" or \"channel\" but I got " + JSON.stringify(this.chooseIn));
    }

    /**
     * The solo mode for rock paper scissor. User VS Bot
     * @param {Discord.Message} message The messae object in which command was used
     * @param {Discord.Client} bot The client object
     */
    async solo(message, bot) {
        const winConditions = {
            '✊': '✌️',
            '🤚': '✊',
            '✌️': '🤚'
        }

        return new Promise(async res => {
            message.author = message.author || message.user;

            getChoice.bind(this)(message.author, await message.author.createDM()).then(v => {
                const userChoice = v.choice;
                const sent = v.message;
                const choice = getEmoji(Math.floor(Math.random() * 3) + 1);

                let row = new Discord.ActionRowBuilder()
                    .addComponents(new Discord.ButtonBuilder()
                        .setCustomId("y7ghjuiojioujoj")
                        .setDisabled(true)
                        .setStyle(Discord.ButtonStyle.Success)
                        .setEmoji("🕊")
                        .setLabel("Game Ended")
                    );

                if (userChoice === choice) { // draw
                    if (this.endReply) {
                        const data = {
                            embeds: [new Discord.EmbedBuilder({
                                title: this.drawEndTitle,
                                description: this.drawEndDescription
                                    .replace(/{player1}/g, message.author.username)
                                    .replace(/{player1move}/g, userChoice)
                                    .replace(/{player2}/g, bot.user.username || "Bot")
                                    .replace(/{player2move}/g, choice)
                            }).setColor(this.colors.drawEmbed)],
                            components: [row]
                        };

                        if (message.ephemeral) message.editReply(data);
                        else sent.edit(data);
                    }

                    res({
                        failed: false,
                        winner: -1,
                        reason: "draw"
                    });
                } else if (winConditions[choice] !== userChoice) { // user win
                    if (this.endReply) {
                        const data = {
                            embeds: [new Discord.EmbedBuilder({
                                title: this.endTitle
                                    .replace(/{winner}/g, message.author.username)
                                    .replace(/{looser}/g, bot.user.username),
                                description: this.endDescription
                                    .replace(/{winner}/g, message.author.username)
                                    .replace(/{winnermove}/g, userChoice).replace(/{looser}/g, bot.user.username || "Bot")
                                    .replace(/{loosermove}/g, choice)
                            }).setColor(this.colors.endEmbed)],
                            components: [row]
                        };

                        if (message.ephemeral) message.editReply(data);
                        else sent.edit(data);
                    }

                    res({
                        failed: false,
                        victory: 1,
                        reason: "victory"
                    });
                } else { // User loose
                    if (this.endReply) {
                        const data = {
                            embeds: [new Discord.EmbedBuilder({
                                title: this.endTitle
                                    .replace(/{looser}/g, message.author.username)
                                    .replace(/{winner}/g, bot.user.username),
                                description: this.endDescription
                                    .replace(/{looser}/g, message.author.username)
                                    .replace(/{loosermove}/g, userChoice)
                                    .replace(/{winner}/g, bot.user.username || "Bot")
                                    .replace(/{winnermove}/g, choice)
                            }).setColor(this.colors.endEmbed)],
                            components: [row]
                        };

                        if (message.ephemeral) message.editReply(data);
                        else sent.edit(data);
                    }

                    res({
                        failed: false,
                        victory: 0,
                        reason: "defeat"
                    });
                }
            }).catch(e => {
                if (e.username) {
                    if (this.endReply) {
                        if (!message.replied && !message.deferred) message.reply(`I was unable to DM ${e.username}`);
                        else message.followUp(`I was unable to DM ${e.username}`);
                    }
                    res({
                        failed: true,
                        victory: null,
                        reason: "Bot was unable to dm the user"
                    });
                } else {
                    if (this.endReply) {
                        if (!message.replied && !message.deferred) message.reply("There was a error in executing the command");
                        else message.followUp("There was a error in executing the command");
                    }

                    res({
                        failed: true,
                        victory: null,
                        reason: e,
                    });
                }
            })
        })
    }

    /**
     * The dyo mode for rock paper scissor. User VS Bot
     * @param {Discord.Message} message The messae object in which command was used
     * @param {Discord.User} player2 The Second Player's Discord User Object
     */
    async duo(message, player2) {
        return new Promise(async res => {
            message.author = message.author || message.user;

            if (!message || !message.author) return res({
                failed: true,
                victory: -1,
                reason: "Invalid message object"
            });

            if (!player2 || !player2.username) return res({
                failed: true,
                victory: -1,
                reason: "Invalid Player 2 Object"
            });

            const player1 = message.author;
            const sent = await message.channel.send({
                embeds: [new Discord.EmbedBuilder({
                    title: this.readyMessage
                }).setColor(this.colors.readyEmbed)]
            });

            let no = false, player1Choice = "", player2Choice = "";

            if (this.chooseIn === "dm") {
                await message.channel.send({ content: `${player1.toString()}`, reply: { messageReference: sent.id } });
                await getChoice.bind(this)(player1, await player1.createDM())
                    .then(v => player1Choice = v.choice).catch(e => no = e.username)
                await message.channel.send({ content: `${player2.toString()}`, reply: { messageReference: sent.id } });
                await getChoice.bind(this)(player2, await player2.createDM())
                    .then(v => player2Choice = v.choice).catch(e => no = e.username);

                if (no !== false) {
                    if (this.endReply) {
                        const data = {
                            components: [],
                            embeds: [new Discord.EmbedBuilder({
                                title: `I was unable to DM ${no}, so please open DM than try again.`
                            }).setColor(this.colors.errorEmbed)]
                        };

                        if (message.ephemeral) message.editReply(data);
                        else sent.edit(data);
                    }

                    return res({
                        failed: true,
                        victory: null,
                        reason: `Bot was unable to dm ${no}`
                    });
                }

                let row = new Discord.ActionRowBuilder()
                    .addComponents(new Discord.ButtonBuilder()
                        .setCustomId("y7ghjuiojioujoj")
                        .setDisabled(true)
                        .setStyle(Discord.ButtonStyle.Success)
                        .setEmoji("🕊")
                        .setLabel("Game Ended"))

                if (player1Choice === player2Choice) { // draw
                    if (this.endReply) {
                        const data = {
                            embeds: [new Discord.EmbedBuilder({
                                title: this.drawEndTitle,
                                description: this.drawEndDescription
                                    .replace(/{player1}/g, message.author.username)
                                    .replace(/{player1move}/g, player1Choice)
                                    .replace(/{player2}/g, player2.username)
                                    .replace(/{player2move}/g, player2Choice)
                            }).setColor(this.colors.drawEmbed)],
                            components: [row]
                        };

                        if (message.ephemeral) message.editReply(data);
                        else sent.edit(data);
                    }

                    res({
                        failed: false,
                        winner: -1,
                        reason: "draw"
                    });
                } else if (winConditions[player2Choice] !== player1Choice) { // player 1 won
                    if (this.endReply) {
                        const data = {
                            embeds: [new Discord.EmbedBuilder({
                                title: this.endTitle
                                    .replace(/{winner}/g, message.author.username)
                                    .replace(/{looser}/g, player2.username),
                                description: this.endDescription
                                    .replace(/{winner}/g, message.author.username)
                                    .replace(/{winnermove}/g, player1Choice)
                                    .replace(/{looser}/g, player2.username || "Bot")
                                    .replace(/{loosermove}/g, player2Choice)
                            }).setColor(this.colors.e)],
                            components: [row]
                        };

                        if (message.ephemeral) message.editReply(data);
                        else sent.edit(data);
                    }

                    res({
                        failed: false,
                        winner: 0,
                        reason: "player one won"
                    });
                } else { // player 2 won
                    if (this.endReply) {
                        const data = {
                            embeds: [new Discord.EmbedBuilder({
                                title: this.endTitle
                                    .replace(/{looser}/g, message.author.username)
                                    .replace(/{winner}/g, player2.username),
                                description: this.endDescription
                                    .replace(/{looser}/g, message.author.username)
                                    .replace(/{loosermove}/g, player1Choice)
                                    .replace(/{winner}/g, player2.username || "Bot")
                                    .replace(/{winnermove}/g, player2Choice)
                            }).setColor(this.colors.e)],
                            components: [row]
                        };

                        if (message.ephemeral) message.editReply(data);
                        else sent.edit(data);
                    }

                    res({
                        failed: false,
                        winner: 1,
                        reason: "player two won"
                    });
                }
            } else {
                await getChoices.bind(this)(player1, player2, message).then(v => {
                    player1Choice = v.p1choice;
                    player2Choice = v.p2choice;

                    let row = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setCustomId("y7ghjuiojioujoj").setDisabled(true).setStyle(Discord.ButtonStyle.Success).setEmoji("🕊").setLabel("Game Ended"))

                    if (player1Choice === player2Choice) { // draw
                        if (this.endReply) {
                            const data = {
                                embeds: [new Discord.EmbedBuilder({
                                    title: this.drawEndTitle,
                                    description: this.drawEndDescription
                                        .replace(/{player1}/g, message.author.username)
                                        .replace(/{player1move}/g, player1Choice)
                                        .replace(/{player2}/g, player2.username)
                                        .replace(/{player2move}/g, player2Choice)
                                }).setColor(this.colors.drawEmbed)],
                                components: [row]
                            };

                            if (message.ephemeral) message.editReply(data);
                            else sent.edit(data);
                        }

                        res({
                            failed: false,
                            winner: -1,
                            reason: "draw"
                        });
                    } else if (winConditions[player2Choice] !== player1Choice) { // player 1 won
                        if (this.endReply) {
                            const data = {
                                embeds: [new Discord.EmbedBuilder({
                                    title: this.endTitle.replace(/{winner}/g, message.author.username).replace(/{looser}/g, player2.username),
                                    description: this.endDescription
                                        .replace(/{winner}/g, message.author.username)
                                        .replace(/{winnermove}/g, player1Choice)
                                        .replace(/{looser}/g, player2.username || "Bot")
                                        .replace(/{loosermove}/g, player2Choice)
                                }).setColor(this.colors.endEmbed)],
                                components: [row]
                            };

                            if (message.ephemeral) message.editReply(data);
                            else sent.edit(data);
                        }

                        res({
                            failed: false,
                            winner: 0,
                            reason: "player one won"
                        });
                    } else { // player 2 won
                        if (this.endReply) {
                            const data = {
                                embeds: [new Discord.EmbedBuilder({
                                    title: this.endTitle
                                        .replace(/{looser}/g, message.author.username)
                                        .replace(/{winner}/g, player2.username),
                                    description: this.endDescription
                                        .replace(/{looser}/g, message.author.username)
                                        .replace(/{loosermove}/g, player1Choice)
                                        .replace(/{winner}/g, player2.username || "Bot")
                                        .replace(/{winnermove}/g, player2Choice)
                                }).setColor(this.colors.endEmbed)],
                                components: [row]
                            };

                            if (message.ephemeral) message.editReply(data);
                            else sent.edit(data);
                        }

                        res({
                            failed: false,
                            winner: 1,
                            reason: "player two won"
                        });
                    }
                }).catch(e => {
                    if (this.endReply) {
                        sent.edit({
                            components: [],
                            embeds: [new Discord.EmbedBuilder({
                                title: `I was unable to DM ${no}, so please open DM than try again.`
                            }).setColor(this.colors.errorEmbed)]
                        })
                    }

                    return res({
                        failed: true,
                        victory: null,
                        reason: `Bot was unable to dm a user`,
                        error: e
                    });
                });
            }
        });
    }
}

module.exports = rps;

/**
 * @typedef {Object} Colors The colors to use in embeds.
 * @property {String} readyEmbed The color for ready embed.
 * @property {String} errorEmbed The color for error embed.
 * @property {String} drawEmbed The color for draw embed.
 * @property {String} endEmbed The color for draw embed.
 */
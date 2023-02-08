const Discord = require('discord.js'), getEmoji = require('./getEmoji');

/**
 * 
 * @param {Discord.Message | Discord.CommandInteraction} message 
 * @returns 
 */
function getChoice(user, channel) {
    return new Promise(async (res, rej) => {
        try {
            const row = new Discord.ActionRowBuilder().addComponents([new Discord.ButtonBuilder().setCustomId("1_rock_paper_scissor").setStyle(Discord.ButtonStyle.Primary).setEmoji("✊").setLabel("Rock"), new Discord.ButtonBuilder().setCustomId("2_rock_paper_scissor").setStyle(Discord.ButtonStyle.Primary).setEmoji("🖐").setLabel("Paper"), new Discord.ButtonBuilder().setCustomId("3_rock_paper_scissor").setStyle(Discord.ButtonStyle.Primary).setEmoji("✌").setLabel("Scissor")]),
                data = {
                    components: [row],
                    embeds: [
                        new Discord.EmbedBuilder({
                            title: this.choiceTitle,
                            description: this.choiceDescription
                        }).setColor(this.colors.choiceEmbed)
                    ]
                };

            let sent;

            channel.send(data).then(v => sent = v).catch((e) => { rej(user) });

            const collector = channel.createMessageComponentCollector({ filter: (i) => i.user.id === user.id && (i.customId.endsWith("_rock_paper_scissor")) });

            collector.on('collect', (interaction) => {
                if (!this.replyChoice) interaction.deferUpdate();

                const userChoice = parseInt(interaction.customId[0]);

                if (this.replyChoice) interaction.reply({ ephemeral: true, content: this.choiceReply.replace("{move}", getEmoji(userChoice)) })

                collector.stop(userChoice);
            });

            collector.once('end', (f, r) => res({ choice: getEmoji(r), message: sent }));
        } catch (e) {
            rej(e);
        }
    })
}

module.exports = getChoice;
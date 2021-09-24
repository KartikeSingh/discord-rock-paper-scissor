const Discord = require('discord.js'), getEmoji = require('./getEmoji');

/**
 * 
 * @param {Discord.User} player1
 * @param {Discord.User} player2
 * @param {Discord.Message} message
 * @returns 
 */
function getChoice(player1, player2, message) {
    return new Promise(async (res, rej) => {
        try {
            const row1 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("1_rock_paper_scissor_a").setStyle("PRIMARY").setEmoji("✊").setLabel("Rock"), new Discord.MessageButton().setCustomId("2_rock_paper_scissor_a").setStyle("PRIMARY").setEmoji("🖐").setLabel("Paper"), new Discord.MessageButton().setCustomId("3_rock_paper_scissor_a").setStyle("PRIMARY").setEmoji("✌").setLabel("Scissor")]);
            const row2 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("1_rock_paper_scissor_b").setStyle("PRIMARY").setEmoji("✊").setLabel("Rock"), new Discord.MessageButton().setCustomId("2_rock_paper_scissor_b").setStyle("PRIMARY").setEmoji("🖐").setLabel("Paper"), new Discord.MessageButton().setCustomId("3_rock_paper_scissor_b").setStyle("PRIMARY").setEmoji("✌").setLabel("Scissor")]);

            let sent = await message.channel.send({ components: [row1, row2], embeds: [{ color: this.colors.choiceEmbed, title: this.choiceTitle, description: this.choiceDescription }] })

            const collector = message.channel.createMessageComponentCollector({ filter: (i) => i.message.id === sent.id && (i.customId.includes("_rock_paper_scissor_")) });

            let p1choice, p2choice;

            collector.on('collect', async (interaction) => {
                if (interaction.customId.endsWith("_a")) {
                    row1.components.forEach(v => v.setDisabled(true));
                    p1choice = getEmoji(parseInt(interaction.customId[0]));

                    interaction.reply({ ephemeral: true, content: this.choiceReply.replace("{move}", getEmoji(p1choice)) })
                    await sent.edit({ components: [row1, row2] });
                } else {
                    row2.components.forEach(v => v.setDisabled(true));
                    p2choice = getEmoji(parseInt(interaction.customId[0]));

                    interaction.reply({ ephemeral: true, content: this.choiceReply.replace("{move}", getEmoji(p2choice)) })
                    await sent.edit({ components: [row1, row2] });
                }

                if (p2choice && p1choice) {
                    res({ p1choice, p2choice });
                    sent.delete();
                    collector.stop();
                }
            });
        } catch (e) {
            console.log(e);
            rej(e);
        }
    })
}

module.exports = getChoice;
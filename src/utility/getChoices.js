const Discord = require('discord.js'), getEmoji = require('./getEmoji');

/**
 * 
 * @param {Discord.Message} message
 * @returns 
 */
function getChoice(player1, player2, message) {
    return new Promise(async (res, rej) => {
        try {
            const row1 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("1_rock_paper_scissor_a").setStyle("PRIMARY").setEmoji("✊").setLabel("Rock"), new Discord.MessageButton().setCustomId("2_rock_paper_scissor_a").setStyle("PRIMARY").setEmoji("🖐").setLabel("Paper"), new Discord.MessageButton().setCustomId("3_rock_paper_scissor_a").setStyle("PRIMARY").setEmoji("✌").setLabel("Scissor")]);
            const row2 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("1_rock_paper_scissor_b").setStyle("PRIMARY").setEmoji("✊").setLabel("Rock"), new Discord.MessageButton().setCustomId("2_rock_paper_scissor_b").setStyle("PRIMARY").setEmoji("🖐").setLabel("Paper"), new Discord.MessageButton().setCustomId("3_rock_paper_scissor_b").setStyle("PRIMARY").setEmoji("✌").setLabel("Scissor")]);
            const data = { components: [row1, row2], embeds: [{ color: this.colors.choiceEmbed, title: this.choiceTitle, description: this.choiceDescription }] };

            let sent;

            if (message.deferReply) message[message.replied || message.deferred ? "followUp" : "reply"](data).then(v => sent = v).catch((e) => { rej(user) });
            else message.channel.send(data).then(v => sent = v).catch((e) => { rej(user) });

            const collector = message.createMessageComponentCollector({ filter: (i) => (i.customId.includes("_rock_paper_scissor_")) && [player1.id, player2.id].some(x => x === i.user.id) });

            let p1choice, p2choice;

            collector.on('collect', async (interaction) => {

                if (interaction.customId.endsWith("_a") && interaction.user.id === player1.id) {
                    row1.components.forEach(v => v.setDisabled(true));
                    p1choice = getEmoji(parseInt(interaction.customId[0]));

                    if (this.replyChoice) interaction.reply({ ephemeral: true, content: this.choiceReply.replace("{move}", getEmoji(p1choice)) })
                    else interaction.deferUpdate();

                    await sent.edit({ components: [row1, row2] });
                } else if (interaction.customId.endsWith("_b") && interaction.user.id === player2.id) {
                    row2.components.forEach(v => v.setDisabled(true));
                    p2choice = getEmoji(parseInt(interaction.customId[0]));

                    if (this.replyChoice) interaction.reply({ ephemeral: true, content: this.choiceReply.replace("{move}", getEmoji(p2choice)) })
                    else interaction.deferUpdate();

                    await sent.edit({ components: [row1, row2] });
                } else {
                    interaction.reply({
                        embeds: [{
                            color: "RED",
                            title: "❌ Invalid Button Used"
                        }]
                    })
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
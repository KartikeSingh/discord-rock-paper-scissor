const Discord = require('discord.js'), getEmoji = require('./getEmoji');

/**
 * 
 * @param {Discord.User} user 
 * @param {Discord.TextChannel} channel 
 * @returns 
 */
function getChoice(user, channel) {
    return new Promise(async (res, rej) => {
        try {
            const row = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("1_rock_paper_scissor").setStyle("PRIMARY").setEmoji("✊").setLabel("Rock"), new Discord.MessageButton().setCustomId("2_rock_paper_scissor").setStyle("PRIMARY").setEmoji("🖐").setLabel("Paper"), new Discord.MessageButton().setCustomId("3_rock_paper_scissor").setStyle("PRIMARY").setEmoji("✌").setLabel("Scissor")])
            let sent;

            channel.send({ components: [row], embeds: [{ color: "FUCHSIA", title: this.choiceTitle, description: this.choiceDescription }] }).catch((e) => { rej(user) }).then(v => sent = v);

            const collector = channel.createMessageComponentCollector({ filter: (i) => i.user.id === user.id && (i.customId.endsWith("_rock_paper_scissor")) });

            collector.on('collect', (interaction) => {
                const userChoice = parseInt(interaction.customId[0]);

                interaction.reply({ ephemeral: true, content: this.choiceReply.replace("{move}", getEmoji(userChoice)) })

                collector.stop(userChoice);
            });

            collector.once('end', (f, r) => res({ choice: getEmoji(r), message: sent }));
        } catch (e) {
            console.log(e)
            rej(e);
        }
    })
}

module.exports = getChoice;
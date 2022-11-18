const Discord = require('discord.js'), getEmoji = require('./getEmoji');

/**
 * 
 * @param {Discord.Message | Discord.CommandInteraction} message 
 * @returns 
 */
function getChoice(message) {
    return new Promise(async (res, rej) => {
        try {
            const user = message.author,
                channel = message.channel,
                row = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("1_rock_paper_scissor").setStyle("PRIMARY").setEmoji("✊").setLabel("Rock"), new Discord.MessageButton().setCustomId("2_rock_paper_scissor").setStyle("PRIMARY").setEmoji("🖐").setLabel("Paper"), new Discord.MessageButton().setCustomId("3_rock_paper_scissor").setStyle("PRIMARY").setEmoji("✌").setLabel("Scissor")]),
                data = { components: [row], embeds: [{ color: this.colors.choiceEmbed, title: this.choiceTitle, description: this.choiceDescription }] };

            let sent;

            if (message.deferReply) message[message.replied || message.deferred ? "followUp" : "reply"](data).then(v => sent = v).catch((e) => { rej(user) });
            else channel.send(data).then(v => sent = v).catch((e) => { rej(user) });

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
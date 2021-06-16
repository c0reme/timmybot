const Discord = require('discord.js');
const { isNil } = require('lodash');

module.exports = {
    name: 'help',
    cmd: {
        data: {
            "name": "help",
            "description": "Provides helpful information about the bot and the available commands.",
            "options": [
                {
                    "type": 3,
                    "name": "command",
                    "description": "The name of the command.",
                    "required": false,
                    "choices": [
                        {
                            "name": "8ball",
                            "value": "8ball"
                        },
                        {
                            "name": "avatar",
                            "value": "avatar"
                        },
                        {
                            "name": "chat",
                            "value": "chat"
                        }
                    ]
                }
            ]
        }
    },
    /**
     * Runs the interaction event.
     * @param {Any} interaction 
     * @param {Discord.Client} client 
     */
    run: async (interaction, client) => {
        const data = interaction.data;
        console.log(data)
        if (isNil(data.options)) {
            return {
                embeds: [
                    new Discord.MessageEmbed()
                        .setAuthor(`${client.user.username}'s commands`, client.user.avatarURL())
                        .setThumbnail(client.user.avatarURL())
                        .setDescription(`My prefix here is \`/\`, you can use \`/help [command]\` to learn more about a certain command, maybe you could check out the slash commands too.`)
                        .setFooter(`🏷️ v${require('../../package.json').version} | timmyshiba.xyz`)
                ]
            }
        }
        const { cmd } = client.slash.get(data.options[0].value);
        return {
            embeds: [
                new Discord.MessageEmbed()
                    .setAuthor(`Command: ${cmd.data.name[0].toUpperCase() + cmd.data.name.slice(1)}`)
                    .setThumbnail(client.user.avatarURL())
                    .setDescription(cmd.data.description)
                    .addField('Options', `\`${cmd.data.options.map(opt => {
                        let op = '*';
                        if (opt.required === true) op = '';
                        return `${op}${opt.name}`
                    }).join('`, `')}\``)
            ]
        }
    }
}
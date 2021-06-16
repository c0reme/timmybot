const Discord = require('discord.js');
const { isNil } = require('lodash');

module.exports = {
    name: 'avatar',
    cmd: {
        data: {
            "name": "avatar",
            "description": "Gets the provided user's avatar, if none provided it will provide the executors avatar.",
            "options": [
                {
                    "type": 6,
                    "name": "user",
                    "description": "Gets the provided user's avatar.",
                    "default": false,
                    "required": false
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
        let user = client.users.cache.get(interaction.member.user.id);
        if (!isNil(data.options)) user = client.users.cache.get(data.options[0].value);
        return {
            embeds: [
                new Discord.MessageEmbed()
                    .setAuthor(user.username, user.avatarURL())
                    .setDescription(`**[Download avatar](${user.avatarURL({ size: 1024, dynamic: true })})**`)
                    .setImage(user.avatarURL({ size: 1024, dynamic: true }))
            ]
        }
    }
}
const Discord = require('discord.js');
let { db, json } = require('../../config');

module.exports = {
    name: 'settings',
    cmd: {
        data: {
            "name": "settings",
            "description": "Allows changes to be made to the server's config.",
            "options": [
                {
                    "type": 3,
                    "name": "action",
                    "description": "The action being made.",
                    "required": true,
                    "choices": [
                        {
                            "name": "webhooks",
                            "value": "webhooks"
                        }
                    ]
                },
                {
                    "type": 5,
                    "name": "boolean",
                    "description": "If the actions requires a boolean value.",
                    "required": false
                },
                {
                    "type": 3,
                    "name": "string",
                    "description": "If the actions requires a string value.",
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
        const key = interaction.guild_id;

        let setting = data.options[0].value;
        const value = data.options[1].value;
        await db.guild.get(key);
        if (['webhooks'].includes(setting)) {
            setting = setting[0].toUpperCase() + setting.slice(1);
            let data = await db.guild.get(`${key}.webhooks`);
            if (typeof value !== 'boolean') return {
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor(json.colors.err)
                        .setDescription(`Value is not type boolean`)
                ]
            }
            if (data === value) {
                if (value === false) return {
                    embeds: [
                        new Discord.MessageEmbed()
                            .setColor(json.colors.failed)
                            .setDescription(`<:x_:852461875434225674> Failed, **${setting}** are already disabled!`)
                    ]
                }
                return {
                    embeds: [
                        new Discord.MessageEmbed()
                            .setColor(json.colors.failed)
                            .setDescription(`<:x_:852461875434225674> Failed, **${setting}** are already enabled!`)
                    ]
                }
            }
            await db.guild.set(`${key}.webhooks`, value);
            console.log(await db.guild.get(`${key}.webhooks`), value)
            if (value === false) return {
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor(json.colors.failed)
                        .setDescription(`<:x_:852461875434225674> **${setting}** has been disabled successfully!`)
                ]
            }
            return {
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor(json.colors.def)
                        .setDescription(`<:tick_:852461875563855872> **${setting}** has been enabled successfully!`)
                ]
            }
        }
    }
}
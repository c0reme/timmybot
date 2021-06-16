const Discord = require('discord.js');
const { isNil } = require('lodash');

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
        
    }
}
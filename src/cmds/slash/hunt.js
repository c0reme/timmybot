const Discord = require('discord.js');
const { isNil } = require('lodash');

module.exports = {
    name: 'hunt',
    cmd: {
        data: {
            "name": "hunt",
            "description": "Proceeds to go out hunting for resources, I wonder what you will find!",
            "options": [
              {
                "type": 3,
                "name": "place",
                "description": "A place to hunt for certain resources.",
                "required": false,
                "choices": [
                  {
                    "name": "green_fields",
                    "value": "green_fields"
                  }
                ]
              },
              {
                "type": 3,
                "name": "reward",
                "description": "Displays the rewards available for each place and their rarity.",
                "required": false,
                "choices": [
                  {
                    "name": "all",
                    "value": "all"
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
        
    }
}
const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    name: '8ball',
    cmd: {
        data: {
            "name": "8ball",
            "description": "Find the answers to your questions",
            "options": [
                {
                    "type": 3,
                    "name": "question",
                    "description": "What do you wish for?",
                    "default": false,
                    "required": true
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
        const options = [
            'As I see it, yes.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don’t count on it.',
            'It is certain.',
            'It is decidedly so.',
            'Most likely.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Outlook good.',
            'Reply hazy, try again.',
            'Signs point to yes.',
            'Very doubtful.',
            'Without a doubt.',
            'Yes.',
            'Yes – definitely.',
            'You may rely on it.'
        ];
        const author = client.users.cache.get(interaction.member.user.id);
        return {
            content: `🎱 **${author.username}**, ${options[Math.floor(Math.random() * options.length)]}`
        }
    }
}
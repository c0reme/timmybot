const Discord = require('discord.js');
const config = require('../config');

// Cleans the evaled code, provided by Evie (Enmap and Josh author)
/**@returns {String} */
const clean = async (client, text) => {
    if (text && text.constructor.name == 'Promise')
        text = await text;
    if (typeof text !== 'string')
        text = require('util').inspect(text, { depth: 1 });
    text = text
        .replace(/`/g, '`' + String.fromCharCode(8203))
        .replace(/@/g, '@' + String.fromCharCode(8203))
        .replace(client.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');
    return text;
}

// DO NOT LET OTHERS HAVE ACCESS TO THIS COMMAND!!
module.exports = {
    name: 'eval',
    aliases: ['eval'],
    type: 'dev',
    description: 'Evaluates code provided by the user.',
    args: ['<code>'],
    /**
     * 
     * @param {Discord.Message} message 
     * @param {String[]} args 
     * @param {Discord.Client} client 
     */
    execute: async (message, args, client) => {
        if (message.author.id !== '373799100153593857') return;
        let code = args.join(' ');
        try {
            let evaled = await clean(client, await eval(code));
            if (evaled.length > 1000) {
                return message.reply('', new Discord.MessageAttachment(Buffer.from(evaled, 'utf-8'), 'evaled.txt'));
            }
            return message.reply(`\`\`\`js\n${evaled}\`\`\``);
        } catch (error) {
            return message.reply(`\`\`\`js\n${error}\`\`\``)
        }
    }
}
// Requires the configuration file.
const config = require('./config');

// Requires and defines a new Discord client.
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'] });
require('./api/InlineReply');

// Logs in the client using the token found in the config file.
client.login(config.token);
// Obtains all of the commands located in the commands folder ONLY.
const fs = require('fs');
const { isNil, isObject } = require('lodash');
const cmds = new Discord.Collection();
for (const file of fs.readdirSync('./cmds').filter(file => file.endsWith('.js'))) {
    const cmd = require(`./cmds/${file}`);
    cmds.set(cmd.name, cmd);
}
// Attaches the commands collection to the client variable.
client.cmds = cmds;
// 
client.once('ready', async () => {
    client.user.setActivity({ name: `/help`, type: 'LISTENING' })
    console.log(`${client.user.username} is ready and waiting with ${cmds.size} commands.`);
});

let slash = new Discord.Collection();
for (let f of fs.readdirSync('./cmds/slash').filter(file => file.endsWith('js'))) {
    const cmd = require(`./cmds/slash/${f}`);
    slash.set(cmd.name.toLowerCase(), cmd);
}
const run = async (interaction) => {
    for (cmd of slash) {
        if (cmd[0] === interaction.data.name) {
            return client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: await cmd[1].run(interaction, client)
                }
            })
        }
    }
}
client.slash = slash;
client.ws.on('INTERACTION_CREATE', async interaction => await run(interaction));

// Webhook talking controller.
client.on('message', async message => {
    if (message.author.bot) return;
    // Defines the key used in the databases.
    let key = message.guild.id;
    // Ensures the databases
    await config.db.guild.get(key);
    // Gets the guild's prefix and returns if it doesn't begin with it.
    const prefix = String(await config.db.guild.get(`${key}.prefix`));
    if (message.content.startsWith(prefix)) return;

    key = message.author.id;
    let webhooks = await config.db.wb.get(key);
    if (webhooks.length === 0) return;
    for (const wb of webhooks) {
        if (wb.linked === false) continue;
        const webhook = (await message.guild.fetchWebhooks()).get(wb.wbID);
        if (webhook) {
            let channel = message.guild.channels.cache.get(wb.channel);
            if (!channel) channel = message.channel;
            if (channel.id === message.channel.id) {
                if (webhook.channelID !== channel.id) {
                    await webhook.edit({
                        channel: channel.id
                    })
                }
                if (message.content) {
                    await message.delete();
                    try {
                        if (isObject(JSON.parse(message.content))) {
                            return (await webhook.send({ embeds: [JSON.parse(message.content)] }))
                        }
                    } catch (error) {
                        return webhook.send(message.content, {
                            files: message.attachments.map(file => file)
                        })
                    };
                };
                if (!message.content && message.attachments) {
                    await message.delete();
                    return webhook.send({
                        files: message.attachments.map(file => file)
                    });
                }
            }
        }
    }
})

//
client.on('message', async message => {
    // If the message author is a bot it will return, this stops the code from looping whenever the bot sends a message.
    if (message.author.bot || message.channel.type !== 'text') return;

    // Defines the key used in the databases.
    let key = message.guild.id;
    // Ensures the databases
    await config.db.guild.get(key);

    // Gets the guild's prefix and returns if it doesn't begin with it.
    const prefix = await config.db.guild.get(`${key}.prefix`);
    if (!message.content.startsWith(prefix)) return;
    client.prefix = prefix;

    // Splits the message into a string array.
    const args = message.content.slice(prefix.length).split(/ +/);
    const idx = args.shift().toLowerCase();

    // Loops through the list of commands and checks if the command can be triggered.
    /*
        This way is cleaner than doing a mariad of IF statments and is dynamic - which allows new commands to be added without any IF statement made.
    */
    for (const cmd of cmds) {
        if (cmd[1].aliases.includes(idx)) {
            return cmd[1].execute(message, args, client);
        }
    }
})
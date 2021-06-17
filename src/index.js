const Discord = require('discord.js');
require('./api/InlineReply');

// Assigns "viewable" values to the client.
const fs = require('fs');
const slash = require('./api/Slash')
class Client extends Discord.Client {
    constructor() {
        super()
        this.login(require('./token'));
        this.logger = require('./api/Logger');
        this.slash = require('./api/Slash');
        this.slash.client = this;
    }
    get cmds() {
        let collection = new Discord.Collection();
        for (let file of fs.readdirSync('./src/cmds').filter(file => file.endsWith('js'))) {
            const cmd = require(`./cmds/${file}`);
            collection.set(cmd.name.toLowerCase(), cmd);
        }
        return collection;
    }
}

// Defines the client and logs it in.
const client = new Client();

// Sends a message to the console when the bot is ready.
client.on('ready', async () => {
    const servers = client.guilds.cache.size;
    await client.user.setActivity(
        {
            name: `in ${config.commaify(servers)} ${config.plural('server', servers)}`,
            type: 'WATCHING'
        }
    )
    client.logger.info(`${client.user.username} is ready and waiting.`);
})

const config = require('./config');
client.on('guildCreate', async guild => await config.db.guild.set(guild.id));
client.on('guildCreate', async guild => await config.db.guild.delete(guild.id));

client.slash.client = client;
// Runs the slash command when found.
client.ws.on('INTERACTION_CREATE', async interaction => await client.slash.run(interaction))

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
    for (const cmd of client.cmds) {
        if (cmd[1].aliases.includes(idx)) {
            return cmd[1].execute(message, args, client);
        }
    }
})
const Discord = require('discord.js');
const fs = require('fs');
const { isNil } = require('lodash');

class Slash {
    #cli;
    get client() {
        return this.#cli;
    }
    /**
     * @param {Discord.Client} client 
     */ 
    set client(client) {
        this.#cli = client;
        return this.client;
    }

    get files() {
        let collection = new Discord.Collection();
        for (let file of fs.readdirSync('./src/cmds/slash').filter(file => file.endsWith('js'))) {
            const cmd = require(`../cmds/slash/${file}`);
            collection.set(cmd.name.toLowerCase(), cmd);
        }
        return collection;
    }

    /** 
     * @param {String} guild_id
     * @returns {Promise<Any[]>}
    */
    #commands = async (guild_id = null) => {
        if (isNil(guild_id)) {
            return this.client.api.applications(this.client.user.id).commands.get();
        }
        if (isNil(this.client.guilds.cache.get(guild_id))) throw 'Could not find specified guild.'
        return this.client.api.applications(this.client.user.id).guilds(guild_id).commands.get();
    }

    async post(data, guild_id = null) {
        if (isNil(data)) return;
        if (typeof data !== 'object') return;
        if (isNil(guild_id)) {
            return await this.client.api.applications(this.client.user.id).commands.post({
                data: data
            })
        }
        return await this.client.api.applications(this.client.user.id).guilds(guild_id).commands.post({
            data: data
        })
    }

    async run(interaction) {
        for (let cmd of this.files) {
            if (cmd[0] === interaction.data.name) {
                const data = await cmd[1].run(interaction, this.client);
                console.log(data)
                return this.client.api.applications(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: data
                    }
                })
            }
        }
        return null;
    }
}
module.exports = new Slash();
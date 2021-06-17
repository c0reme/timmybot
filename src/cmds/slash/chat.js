const Discord = require('discord.js');
const { isNil } = require('lodash');
const config = require('../../config');


const { default: Josh } = require('@joshdb/core');
class Webhooks {
    /**
     * 
     * @param {*} interaction 
     * @param {Discord.Client} client 
     */
    constructor(interaction, client) {
        this.user = client.users.cache.get(interaction.member.user.id);
        this.channel = client.channels.cache.get(interaction.channel_id);
        this.data = interaction.data
    }
    /** @returns {String} */
    get key() { return this.user.id };
    /** @returns {Promise<Discord.WebhookClient[]>} */
    get webhooks() { return this.channel.guild.fetchWebhooks() };
    /**
     * @returns {String}
     */
    get id() {
        if (isNil(this.data.options.find(opt => opt.name === 'id')?.value.toLowerCase())) return Math.random().toString(36).substr(6, 6).toLowerCase();
        return this.data.options.find(opt => opt.name === 'id').value.toLowerCase();
    }
    /**
     * @returns {String}
     */
    get value() {
        if (isNil(this.data.options.find(opt => opt.name === 'value')?.value)) return null;
        return this.data.options.find(opt => opt.name === 'value').value;
    }
    get type() {
        return this.data.options[0].value;
    }
    /**
     * @returns {Josh}
     */
    get db() { return config.db.wb }
    /**
     * 
     * @param {String|Number} key The key used in the database.
     * @param {*} id 
     * @returns {Promise<Discord.Webhook>}
     */
    async get() {
        // Checks if the ID is null or undefined.
        if (isNil(this.id)) return console.error(`The key of webhooks is type ${typeof this.id}`);
        let webhook = (await this.db.get(this.key)).find(wb => wb.id === this.id);
        if (!webhook) return null;
        webhook = (await this.webhooks).find(wb => wb.id === webhook.wbID);
        if (isNil(webhook)) {
            if ((await this.db.get(this.key)).find(wb => wb.id === this.id)) {
                const webhooks = await this.db.get(this.key);
                webhooks.splice(webhooks.indexOf(webhook), 1);
                await this.db.set(this.key, webhooks);
            }
            return null;
        };
        return webhook;
    }
    /**
     * 
     * @param {'new'|'add'} type 
     * @returns 
     */
    async add(type) {
        if (!isNil(await this.get(this.id))) return;
        let webhook;
        if (type === 'new') webhook = await this.channel.createWebhook(this.value, { reason: `(${this.id}) ${this.user.tag}` });
        else if (type === 'add') {
            if (!(/https?:\/\/(www\.)?discord.com\/api\/webhooks\//gm.test(this.value))) return;
            let webhooks = await this.webhooks;
            webhook = webhooks.get(this.value.replace(/https?:\/\/(www\.)?discord.com\/api\/webhooks\//gm, '').split('/')[0]);
        } else return;
        if (!webhook) return;
        await this.db.push(this.key, {
            id: this.id,
            wbID: webhook.id,
            linked: false
        })
        let _type = 'created';
        if (type === 'add') _type = 'added';
        return {
            embeds: [
                new Discord.MessageEmbed()
                    .setColor('#2F3136')
                    .setDescription(`<:tick:852461875563855872> **[${webhook.name}](${webhook.avatarURL()} "'${this.id}' • ${webhook.name}")** has been ${_type} successfully!`)
            ]
        }
    }
    async delete() {
        if (!isNil(await this.get(this.id))) return;
        let wb = await this.get(this.id);
        await wb.delete(`(${this.id}) ${this.user.tag}`);
        const webhook = (await this.db.get(this.key)).find(wb => wb.id === this.id);
        await webhooks.splice(webhooks.indexOf(webhook), 1);
        await this.db.set(this.key, webhooks);
        return {
            embeds: [
                new Discord.MessageEmbed()
                    .setColor('#2F3136')
                    .setDescription(`<:x:852461875434225674> **[${wb.name}](${wb.avatarURL()} "'${id}' • ${wb.name}")** has been deleted successfully!`)
            ]
        }
    }
}

module.exports = {
    name: 'chat',
    cmd: {
        data: {
            "name": "chat",
            "description": "Allows the use of chatting with a webhook.",
            "options": [
                {
                    "type": 3,
                    "name": "type",
                    "description": "The type of action taken place.",
                    "required": true,
                    "choices": [
                        {
                            "name": "list",
                            "value": "list"
                        },
                        {
                            "name": "view",
                            "value": "view"
                        },
                        {
                            "name": "link",
                            "value": "link"
                        },
                        {
                            "name": "unlink",
                            "value": "unlink"
                        },
                        {
                            "name": "new",
                            "value": "new"
                        },
                        {
                            "name": "add",
                            "value": "add"
                        },
                        {
                            "name": "delete",
                            "value": "delete"
                        },
                        {
                            "name": "id",
                            "value": "id"
                        },
                        {
                            "name": "rename",
                            "value": "rename"
                        },
                        {
                            "name": "avatar",
                            "value": "avatar"
                        },
                    ]
                },
                {
                    "type": 3,
                    "name": "id",
                    "description": "The ID used by the member",
                    "required": false
                },
                {
                    "type": 3,
                    "name": "value",
                    "description": "Value(s) needed in the action.",
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
        const wb = new Webhooks(interaction, client);
        wb.db.set(interaction.member.user.id)
        let slots = 1;
        for (let id of ['714149680610803813', '716712328477016175']) {
            if (!client.guilds.cache.get(id)) continue;
            //if (client.guilds.cache.get(id).members.cache.get(user.id)) slots = 5;
        }
        if (interaction.member.user.id !== '373799100153593857') {
            return {
                content: 'Sorry, you cannot use atm.'
            }
        }
        // Creates a new webhook.
        if (['new'].includes(wb.type)) return await wb.add('new');
        // Adds an existing webhook.
        if (['add'].includes(wb.type)) return await wb.add('add');
        // Deletes an existing webhook.
        if (['delete'].includes(wb.type)) return await wb.delete();
        /*// Links the discord user to the webhook.
        if (['link'].includes(type)) {
            const id = data.options.find(opt => opt.name === 'id').value.toLowerCase();
            if (isNil(await get(id))) return;
            let webhooks = await db.get(key);
            let wb = await get(id);
            let webhook = webhooks.find(wb => wb.id === id);
            await webhooks.splice(webhooks.indexOf(webhook), 1, {
                id: id,
                wbID: wb.id,
                linked: true
            })
            await db.set(key, webhooks);
            return {
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor('#2F3136')
                        .setDescription(`🔗 **[${wb.name}](${wb.avatarURL()} "'${id}' • ${wb.name}")** has been linked to you!`)
                ]
            }
        }
        // Unlinks the discord user to the webhook.
        if (['unlink'].includes(type)) {
            const id = data.options.find(opt => opt.name === 'id')?.value.toLowerCase();
            let webhooks = await db.get(key);
            let wb = await get(id);
            if (isNil(wb)) wb = await get(webhooks.find(wb => wb.linked === true).id);
            let webhook = webhooks.find(wb => wb.id === id);
            await webhooks.splice(webhooks.indexOf(webhook), 1, {
                id: id,
                wbID: wb.id,
                linked: false
            })
            await db.set(key, webhooks);
            return {
                embeds: [new Discord.MessageEmbed()
                    .setColor('#2F3136')
                    .setDescription(`🔗 **[${wb.name}](${wb.avatarURL()} "'${id}' • ${wb.name}")** has been unlinked from you!`)
                ]
            }
        }
        // Views details about a certain webhook.
        if (['view'].includes(type)) {
            const id = data.options.find(opt => opt.name === 'id').value.toLowerCase();
            if (isNil(await get(id))) return;
            let wb = await get(id);
            let webhooks = await db.get(key);
            let webhook = webhooks.find(wb => wb.id === id);
            let status = `Unlinked! [${user}]`;
            if (webhook.linked === true) status = `Linked! [${user}]`;
            return {
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor('#2F3136')
                        .setThumbnail(wb.avatarURL({ size: 1024, format: 'png' }))
                        .setAuthor(`(${id}) ${wb.name}`)
                        .setDescription(`Created \`${config.dateEN(wb.createdTimestamp - Date.now())} ago\``)
                        .addField('Status', status)
                ]
            }
        }
        // Lists all of the avaiable webhooks.
        if (['list'].includes(type)) {
            let webhooks = [];
            for (let w of await db.get(key)) {
                if (isNil(await get(w.id))) continue;
                let wb = await get(w.id);
                if (w.linked === true) webhooks.push(`\`${w.id}\` ${wb.name} [${user}]`);
                else webhooks.push(`\`${w.id}\` ${wb.name}`);
            }
            for (let wb of webhooks) {
                webhooks.splice(webhooks.indexOf(wb), 1, `**${webhooks.indexOf(wb) + 1}** - ${wb}`)
            }
            return {
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor('#2F3136')
                        .setAuthor(`List of server webhooks`)
                        .setDescription(webhooks)
                        .setFooter(`${webhooks.length} of ${slots} slots used!`, user.avatarURL())
                ]
            }
        }
        // Changes the webhook's name
        if (['rename'].includes(type)) {
            const id = data.options.find(opt => opt.name === 'id').value.toLowerCase();
            const value = data.options.find(opt => opt.name === 'value').value;
            if (isNil(await get(id))) return;
            let wb = await get(id);
            let temp = wb;
            await wb.edit({
                name: value
            })
            return {
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor('#2F3136')
                        .setDescription(`🏷️ **[${temp.name}](${wb.avatarURL()}} "'${id}' • ${temp.name}")** has been renamed to **[${value}](${wb.avatarURL()} "'${id}' ${wb.name}")**!`)
                ]
            }
        }*/
    }
}
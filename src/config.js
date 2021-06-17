const Josh = require('@joshdb/core');

module.exports = {
    // Databases used by the Discord bot.
    db: {
        guild: new Josh({
            name: 'guild',
            provider: require('@joshdb/sqlite'),
            autoEnsure: {
                prefix: '-',
                webhooks: false
            }
        }),
        wb: new Josh({
            name: 'webhooks',
            provider: require('@joshdb/sqlite'),
            autoEnsure: []
        }),
        cfg: new Josh({
            name: 'config',
            provider: require('@joshdb/json'),
            providerOptions: {
                indexAll: true,
                cleanupEmpty: true
            }
        })
    },
    // Gets the json config.
    json: require('../data/config.json')
}
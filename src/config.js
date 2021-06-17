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
    json: require('../data/config.json'),
    /**
     * Converts the provided number into a comma-fied string or a shorten string.
     * @param {Number} number
     */
    commaify: (number) => {
        let i = number.toString();
        const index = /(-?\d+)(\d{3})/;
        while (index.test(i)) {
            i = i.replace(index, '$1,$2');
        };
        return i;
    },
    /**
     * 
     * @param {String} string 
     * @param {Number} number 
     * @returns 
     */
    plural: (string, number) => {
        if (number !== 1) return `${string}s`;
        return string;
    }
}
const Josh = require("@joshdb/core");
const mongo = require('@joshdb/mongo');
const sqlite = require('@joshdb/sqlite');

const db = {
    guild: new Josh({
        name: 'guild',
        provider: sqlite,
        autoEnsure: {
            prefix: '-'
        }
    }),
    pet: new Josh({
        name: 'pet',
        provider: sqlite,
        autoEnsure: {
            name: '',
            stats: {
                level: 1,
                xp: 0
            },
            upgrades: []
        }
    }),
    dev: new Josh({
        name: 'dev',
        provider: sqlite,
        autoEnsure: {
            copy: {
                state: false,
                channel: null
            },
            wb: []
        }
    }),
    wb: new Josh({
        name: 'webhooks',
        provider: sqlite,
        autoEnsure: []
    })
}

module.exports = {
    db,
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
    dateEN: require('humanize-duration').humanizer({
        largest: 2,
        round: true,
        spacer: ' ',
        conjunction: ' ',
        serialComma: false,
    }),
    token: 'BOT_TOKEN_GOES_HERE'
}
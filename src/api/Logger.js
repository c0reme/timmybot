const chalk = require('chalk');
const moment = require('moment');

class Logger {
    info(data) {
        return console.log(`${moment(Date.now()).format('HH:mm:ss')} ${chalk.cyan('INFO')} ${data}`);
    }
    log(data) {
        return console.log(`${moment(Date.now()).format('HH:mm:ss')} ${chalk.green('LOG')} ${data}`);
    }
    warn(data) {
        return console.log(`${moment(Date.now()).format('HH:mm:ss')} ${chalk.yellow('WARN')} ${data}`);
    }
    error(data) {
        return console.log(`${moment(Date.now()).format('HH:mm:ss')} ${chalk.red('ERROR')} ${data}`);
    }
}

module.exports = new Logger();
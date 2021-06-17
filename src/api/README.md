# Overview
The api used on this Discord bot is free to use by anyone, however all the code created is subject to copyright and the license for the entire project can be found [here](../../LICENSE)

> *If you have any issues using the api please report it as soon as possible using this [link](https://github.com/c0reme/timmybot/issues/new)*

## Installation
To install additional classes to your Discord bot, simply drag and drop them into the [source](/src) folder and require the `index.js` file from anywhere using this:

```js
const api = require('./api/index');
```

## Attaching the API to the Client
There are two ways to attach the API to the client, one simply doing this:
```js
const Discord = require('discord.js');
const client = new Discord.Client();

// Attaches the API to the client, but without IntelliSense (VSCode)
client._api = require('./api/index');
```

Or you can create an extended class, like so:
> *See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes for more information.*

```js
const Discord = require('discord.js');

// Attaches the API to the client, but with IntelliSense (VSCode)
class Client extends Discord.Client() {
    _api = require('./api/index')
}

const client = new Client();
```
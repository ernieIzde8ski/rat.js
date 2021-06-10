# rat.js

Source code for rat.js, programmed by ernieIzde8ski

## Support

- [Discord (ernieizde8ski#4571)](https://discord.gg/cHZYahK)

## How to run it the code

- `git clone https://github.com/ernieIzde8ski/rat.js.git`
- `cd rat.js`
- `npm i`
- `notepad secrets.json` (Windows) OR `nano secrets.json` (Linux)
  - replace `token` with [a valid Discord bot token](https://discord.com/developers/applications), save & exit
- `node bot.js`

### config.json parameters

- trigger_word (type: `String`)
  - phrase the bot will reply to/with
- prefix (type: `String`||`Array`)
  - prefix(es) checked for before parsing commands

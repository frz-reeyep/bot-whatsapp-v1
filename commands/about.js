const bot = require("../bot.js")
const {inspect} = require("util")

module.exports = {
    response: async ({message}, next) => {
        return inspect(bot)
    },
    options: {
        aliases: ["owner"],
        description: "get information about devoloper and owner"
    }
}
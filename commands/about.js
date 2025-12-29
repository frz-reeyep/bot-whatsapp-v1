const {dev, owners} = require("../bot.js")

module.exports = {
    response: async ({message}, next) => {
        console.log(dev, owners)
        return `@${dev.split("@")[0]} - DEV\n@${owners[0].split("@")[0]} - OWNER`
    },
    options: {
        aliases: ["owner"],
        description: "get information about devoloper and owner"
    }
}
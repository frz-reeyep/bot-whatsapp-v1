const {dev, owners} = require("../bot")

module.exports = {
    response: async ({message}, next) => {
        return `@${dev.split("@")[0]} - DEV\n@${owners[0].split("@")[0]} - OWNER`
    },
    options: {
        aliases: ["owner"],
        description: "get information about devoloper and owner"
    }
}
const {bot, owners} = require("../bot.js")

module.exports = {
    response: async ({message}, next) => {
        const owner = owners.map(async x => {
            const data = await bot.getUserData(x.split("@")[0])
            return "@"+data.lid?.split("@")[0]
        })
        return `These is all of my owner numbers\n\n${owner.join("\n")}`
    },
    options: {
        aliases: ["owner"],
        description: "get information about devoloper and owner"
    }
}
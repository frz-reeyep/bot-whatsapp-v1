const fs = require("fs")
const {bot} = require("../bot")

module.exports = {
    response: async ({message}, next) => {
        const path = "./data/profiles/" + (message.toBaileys().key?.senderPn || message.toBaileys().key?.participantPn) + ".json"
        let data
        if(!fs.existsSync(path)) {
            data = {
                name: message.toBaileys().key?.participantAlt || message.toBaileys().key?.remoteJidAlt,
                age: 0
            }

            await fs.writeFileSync(path, JSON.stringify(data, null, 2))
        } else {
            data = JSON.parse(await fs.readFileSync(path, "utf8"))
        }
        const msg = await bot.waitForMessage((m) => m.sender.id === message.sender.id).text
        if(!msg) return "Time to change your name is over"
        data.name = msg
        await fs.writeFileSync(path, JSON.stringify(data, null, 2))
        return "Successfully set your name to "+msg
    },
    options: {
        description: "set your name",
        aliases: ["name"],
        sectionName: "General Menu"
    }
}
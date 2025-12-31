const fs = require("fs")
const {bot} = require("../bot.js")
const {inspect} = require("util")

module.exports = {
    response: async ({message}, next) => {
        const path = "./data/profiles/" + (message.toBaileys().key?.participantAlt || message.toBaileys().key?.remoteJidAlt) + ".json"
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
        await message.reply("Send a text to change name!")
        let msg = await bot.waitForMessage((m) => m.sender.id === message.sender.id && m.type === "text", 60*10*10)
        if(!msg) return "Time to change your name is over"
        msg = msg.text
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
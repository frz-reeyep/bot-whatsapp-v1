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
        await message.reply("Send a number (not float) to change name!")
        let msg = await bot.waitForMessage((m) => m.sender.id === message.sender.id && m.type === "text", 60*10*10*10)
        if(!msg) return "Time to change your name is over"
        else if (isNaN(msg.text)) return "You can't send a word"
        data.age = parseInt(msg.text)
        await fs.writeFileSync(path, JSON.stringify(data, null, 2))
        return "Successfully set your age to "+data.age
    },
    options: {
        description: "set your age",
        aliases: ["age", "setage"],
        sectionName: "General Menu"
    }
}
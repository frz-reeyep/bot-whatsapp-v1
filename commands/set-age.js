const fs = require("fs")
const {bot} = require("../bot.js")
const {inspect} = require("util")
const { isGeneratorFunction } = require("util/types")

module.exports = {
    response: async ({message, captures}, next) => {
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

       if (captures.paramString) {
            data.age = captures.paramString.split(" ")[0]
            if (isNaN(data.age)) return "You can't set age by a word"
            data.age = parseInt(data.age)
            await fs.writeFileSync(path, JSON.stringify(data, null, 2))
            return "Successfully set your age to "+data.age
       } else {
            await message.reply("Send a number (not float) to change name!")
            let msg = await bot.waitForMessage((m) => m.sender.id === message.sender.id && m.type === "text", 60*10*10*10)
            if(!msg) return "Time to change your age is over"
            else if (msg.text.toLowerCase() == "@cancel") {
                await msg.reply("Change age is canceled")
                return
            }
            else if (isNaN(msg.text)) {
                await msg.reply("You can't set age by a word")
                return
            }
            data.age = parseInt(msg.text)
            await fs.writeFileSync(path, JSON.stringify(data, null, 2))
            await msg.reply("Successfully set your age to "+data.age)
            return
       }
    },
    options: {
        description: "set your age",
        aliases: ["age", "setage"],
        sectionName: "General Menu"
    }
}
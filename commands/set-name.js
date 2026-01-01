const fs = require("fs")
const {bot} = require("../bot.js")
const {inspect} = require("util")

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
        if(captures.paramString) {
            data.name = captures.paramString
            if(data.name.length >= 50) return "The name must be less then 50 caracters"
            else if (data.name.includes("@")) return "You can't add @ in your"
            await fs.writeFileSync(path, JSON.stringify(data, null, 2))
            return "Successfully set your name to "+data.name
        } else {
            await message.reply("Send a text to change name!")
            let msg = await bot.waitForMessage((m) => m.sender.id === message.sender.id && m.type === "text", 60*10*10*10)
            if(!msg) return "Time to change your name is over"
            else if (msg.text.toLowerCase() == "@cancel") {
                await msg.reply("Change name is canceled")
                return
            }
            else if (msg.text.includes("@")) {
                await msg.reply("You can't add @ in your")
                return
            }
            else if(msg.text.length >= 50) {
                await msg.reply("The name must be less then 50 caracters")
                return
            }
            data.name = msg.text
            await fs.writeFileSync(path, JSON.stringify(data, null, 2))
            await msg.reply("Successfully set your name to "+data.name)
            return
        }
    },
    options: {
        description: "set your name",
        aliases: ["name", "setname"],
        sectionName: "General Menu"
    }
}
const fs = require("fs")
const { inspect } = require("util")

module.exports = {
    response: async ({message}, next) => {
        const path = "./data/profiles/" + (message.toBaileys().key?.senderPn || message.toBaileys().key?.participantPn) + ".json"
        let data
        if(!fs.existsSync(path)) {
            data = {
                name: message.toBaileys().key?.senderPn || message.toBaileys().key?.participantPn,
                age: 0
            }

            await fs.writeFileSync(path, JSON.stringify(data, null, 2))
        } else {
            data = JSON.parse(await fs.readFileSync(path, "utf8"))
        }
        return `User: ${data.name.endsWith("s.whatsapp.net")?data.name.split("@")[0]:data.name}\nAge: ${data.age?data.age:"Never been set"}`
    },
    options: {
        description: "See your profile",
        aliases: ["profil", "pf", "me"]
    }
}
const bot = require("wachan")
const {inspect} = require("util")
const commands = require("wachan/commands")
const fs = require("fs")
require("dotenv").config()

const owners = process.env.owner_id.split(",").map(x => getJid(x))
const dataPath = "./data/"
const TypeData = ["profiles"]

// Message
bot.onReceive(/^>> (.+)$/si, async (ctx, next) => {
    const {message, captures} = ctx
    if(!permission(message)) return
    const code = captures[0]
    const multiline = code.includes("\n")
    try {
        return inspect(
            multiline?
            await eval(`(async()=>{${code}})()`):
            await eval(code),
            {
                depth: 10
            }
        )
    } catch (e) {
        return e.stack || e.message
    }
})

commands.fromFolder("commands")

// Non message

bot.onReady(async () => {
    if(!fs.existsSync(dataPath)) {
        await fs.mkdirSync(dataPath)
    }
    for(let folder of TypeData) {
        const path = dataPath + folder
        if(!fs.existsSync(path)) {
            await fs.mkdirSync(path, {recursive: true})
        }
    }

    await bot.sendMessage(owners[0], "Ascy is Ready!")
})

function permission(message) {
    // const id = message.sender.id.endsWith("lid")? message.sender.id : message.sender.lid

    const id = message.toBaileys().key.senderPn || message.toBaileys().key.participantPn
    return owners.includes(id)
}

function permissionId(id) {
    const message = {
            toBaileys: () => {return {key: {senderPn: getJid(id)}}} 
    }
    return permission(message)
}

function getJid(id) {
    return id + "@s.whatsapp.net"
}

bot.start()

module.exports = {permission, permissionId, bot, owners}
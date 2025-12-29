const bot = require("wachan")
const {inspect} = require("util")
const commands = require("wachan/commands")
require("dotenv").config()

const owners = process.env.owner_id.split(",").map(x => getJid(x))
const dev = getJid(process.env.dev_id)

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
    await bot.sendMessage(dev, "Ascy is Ready!")
})

function permission(message) {
    // const id = message.sender.id.endsWith("lid")? message.sender.id : message.sender.lid

    const id = message.toBaileys().key.senderPn || message.toBaileys().key.participantPn
    return id == dev || owners.includes(id)
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

module.exports = {permission, permissionId, owners: owners, dev: dev}
const bot = require("wachan")
const {inspect} = require("util")
const commands = require("wachan/commands")
const fs = require("fs")
const { exec } = require("child_process")
require("dotenv").config()

const owners = process.env.owner_id.split(",").map(x => getJid(x))
const dataPath = "./data/"
const TypeData = ["profiles"]

// StartUp

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

    for(let id of owners) {
        console.log(permissionId(id))
    }
    
    await bot.sendMessage(owners[0], "Ascy is Ready!")
})

commands.fromFolder("commands")

// Commands

// Eval
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

// Execute
bot.onReceive(/^\$ (.+)$/si, async ({message, captures}) => {
    if(!permission(message)) return
    exec(captures[0], (error, stdout, stderr) => {
        if(error) return message.reply("ERROR:\n" + error)
        return message.reply(stdout)
    })
})

// Restart
commands.add("restart", async ({message}) => {
    if(!permission(message)) return
    await message.reply("Restarting...")
    exec(`pm2 restart bot -- "restart mode"`)
})

// Functions
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

bot.start({suppressBaileysLogs: false})

module.exports = {permission, permissionId, bot, owners}
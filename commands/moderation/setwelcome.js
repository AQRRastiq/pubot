const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
  name: "setwelcome",
  category: "moderation",
  usage: "setwelcome <#channel>",
  description: "Set the welcome channel",
  run: (client, message, args) => {

    if (!message.member.hasPermission("ADMINISTRATOR") && !message.author.id === "499297738370973716") return message.channel.send(":x: Vous n'avez pas la permission d'exécuter cette commande !").then(msg => {
      setTimeout(() => {
        msg.delete();
      }, 5000)
    })
    
    let channel = message.mentions.channels.first()
    
    if(!channel) {
      return message.channel.send("Veuillez d'abord mentionner le salon de bienvenue !")
    }
    
    //Now we gonna use quick.db
    
    db.set(`welchannel_${message.guild.id}`, channel.id)
    
    message.channel.send(`Le salon de bienvenue est maintenant ${channel} !`)
  }
}
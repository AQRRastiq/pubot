const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
  name: "setlogs",
  category: "moderation",
  usage: "setlogs <#salon>",
  description: "Mettre un salon en tant que salon de logs",
  run: async (client, message, args) => {

    if (!message.author.id === "499297738370973716") return message.channel.send(":x: Vous n'avez pas la permission d'exécuter cette commande !").then(msg => {
      setTimeout(() => {
        msg.delete();
      }, 5000)
    })
    
    let channel = message.mentions.channels.first()
    
    if(!channel) {
      return message.channel.send("Veuillez d'abord mentionner le salon de logs !")
    }
    
    //Now we gonna use quick.db
    
    db.set(`logschannel_${message.guild.id}`, channel.id)
    
    message.channel.send(`Le salon de logs est maintenant ${channel} !`)
  }
}
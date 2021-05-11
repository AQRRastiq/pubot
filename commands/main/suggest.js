const { MessageEmbed } = require("discord.js")


module.exports = {
  name: "suggest",
  usage: "suggest <message>",
  description: "Envoyer une suggestion",
  category: "main",
  run: (client, message, args) => {
    
    if(!args.length) {
      return message.channel.send("Veuillez écrire une suggestion")
    }
    
    let channel = message.guild.channels.cache.find((x) => (x.name === "💡suggestions"))
    
    
    if(!channel) {
      return message.channel.send('Il n\'y a pas de salon avec le nom "💡suggestions"')
    }
                                                    
    
    let embed = new MessageEmbed()
    .setAuthor("SUGGESTION: " + message.author.tag, message.author.avatarURL())
    .setThumbnail(message.author.avatarURL())
    .setColor("#ff2050")
    .setDescription(args.join(" "))
    .setTimestamp()
    
    
    channel.send(embed).then(m => {
      m.react("✅")
      m.react("❌")
    })
    

    
    message.channel.send("Votre suggestion a été envoyé au salon <#" + channel + ">")
    
  }
}
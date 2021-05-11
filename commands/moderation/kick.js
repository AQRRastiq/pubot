const discord = require("discord.js");

module.exports = {
  name: "kick",
  category: "moderation",
  description: "Kick quelqu'un",
  usage: "kick <@utilisateur> <raison>",
  run: (client, message, args) => {
    
    if(!message.member.hasPermission("KICK_MEMBERS")) {
      return message.channel.send(`**${message.author.username}**, Vous ne passerez pas ! (Vous n'avez pas la permission de kick quelqu'un.)`)
    }
    
    if(!message.guild.me.hasPermission("KICK_MEMBERS")) {
      return message.channel.send(`**${message.author.username}**, I do not have enough permission to use this command`)
    }
    
    let target = message.mentions.members.first();
    let reason = args.slice(1).join(" ")
    
    if(!target) {
      return message.channel.send(`**${message.author.username}**, Veuillez mentionner la personne que vous voulez kick.`)
    }
    
    if(target.id === message.author.id) {
      return message.channel.send(`**${message.author.username}**, Vous ne pouvez pas vous kick vous-même !`)
    }
    if(target.id === message.guild.owner.id) {
      return message.channel.send("Tu croyais vraiment pouvoir kick le créateur du serveur ? -_-")
    }
    
   if(!reason) {
     return message.channel.send(`**${message.author.username}**, Veuillez donner une raison pour kick cette personne.`)
   }
    
    let embed = new discord.MessageEmbed()
    .setTitle("Action: Kick")
    .setDescription(`${target} (${target.id}) a été kick pour ${reason}.`)
    .setColor("#ff2050")
    .setFooter(`Kick par ${message.author.username}`);
    
    message.channel.send(embed)
    
    target.kick({ reason: reason });
    
    
    
  }
}
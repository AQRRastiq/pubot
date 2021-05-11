const discord = require("discord.js");

module.exports = {
  name: "unban",
  category: "moderation",
  description: "Débannir quelqu'un",
  usage: "unban <@utilisateur>",
  run: async (client, message, args) => {
    if(!message.member.hasPermission("UNBAN_MEMBERS")) {
      return message.channel.send(`**${message.author.username}**, Vous ne passerez pas ! (Vous n'avez pas la permission de débannir quelqu'un)`)
    }
    
    if(!message.guild.me.hasPermission("UNBAN_MEMBERS")) {
      return message.channel.send(`**${message.author.username}**, I am do not have perms to ban someone`)
    }
    
    const target = args[0]
    
    if(!target) {
      return message.channel.send(`**${message.author.username}**, Veuillez entrer l'ID de la personne que vous voulez débannir.`)
    }
    const reason = args.slice(1).join(" ");
    if(!reason) {
     return message.channel.send(`**${message.author.username}**, Veuillez donner une raison pour débannir ce membre.`)
   }
    
    message.guild.fetchBans().then(bans=> {
      if(bans.size == 0) return 
      let bUser = bans.find(b => b.user.id == target)
      if(!bUser) return
      message.guild.members.unban(bUser.user)
    })

    
   let embed = new discord.MessageEmbed()
     .setTitle("Action : Unban")
     .setDescription(`L'utilisateur avec l'id ${target} a été débanni pour ${reason}.`)
     .setColor("#ff2050")
     .setThumbnail(target.avatarURL)
     .setFooter(`Débanni par ${message.author.tag}`);
    
   message.channel.send(embed)
  }
}
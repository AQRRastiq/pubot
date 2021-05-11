const discord = require("discord.js");

module.exports = {
  name: "ban",
  category: "moderation",
  description: "Bannir quelqu'un",
  usage: "ban <@utilisateur> <raison>",
  run: async (client, message, args) => {
    if(!message.member.hasPermission("BAN_MEMBERS")) {
      return message.channel.send(`**${message.author.username}**, Vous ne passerez pas ! (Vous n'avez pas la permission d'utiliser cette commande)`)
    }
    
    if(!message.guild.me.hasPermission("BAN_MEMBERS")) {
      return message.channel.send(`**${message.author.username}**, I am do not have perms to ban someone`)
    }
    
    const target = message.mentions.members.first();
    const reason = args.slice(1).join(" ");
    
    if(!target) {
      return message.channel.send(`**${message.author.username}**, Veuillez mentionner la personne que vous voulez bannir.`)
    }
    
    if(target.id === message.author.id) {
      return message.channel.send(`**${message.author.username}**, Vous ne pouvez pas vous bannir vous-même`)
    }
    
    if(target.id === message.guild.owner.id) {
      return message.channel.send("Tu croyais vraiment pouvoir warn le créateur du serveur ? -_-")
    }
    
   
    
   if(!reason) {
     return message.channel.send(`**${message.author.username}**, Veuillez donner une raison pour bannir ce membre`)
   }
    
   const banList = await message.guild.fetchBans();

   const bannedUser = banList.find(user => user.id === target.id);

   if (bannedUser) return message.channel.send(`${bannedUser.tag} est déjà banni.`);
    
   let embed = new discord.MessageEmbed()
     .setTitle("Action : Ban")
     .setDescription(`${target} (${target.id}) a été banni pour ${reason}.`)
     .setColor("#ff2050")
     .setThumbnail(target.avatarURL)
     .setFooter(`Banni par ${message.author.tag}`);
    
   message.channel.send(embed)
   target.ban({ reason: reason })
  }
}
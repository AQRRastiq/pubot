const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "mute",
  description: "Mute quelqu'un qui ne respecte pas les règles.",
  category: "moderation",
  usage: "mute <@utilisateur> <raison>",
  run: async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_ROLES")) {
      return message.channel.send(
        "Vous ne passerez pas ! (Vous n'avez pas la permission de mute quelqu'un.)"
      );
    }

    if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
      return message.channel.send("I do not have permission to manage roles.");
    }

    const user = message.mentions.members.first();
    
    if(!user) {
      return message.channel.send("Veuillez mentionner la personne que vous voulez mute.")
    }
    
    if(user.id === message.author.id) {
      return message.channel.send("Vous ne pouvez pas vous mute vous-même !");
    }
    
    if(user.id === message.guild.owner.id) {
      return message.channel.send("Tu croyais vraiment pouvoir mute le créateur du serveur ? -_-")
    }
    
    
    let reason = args.slice(1).join(" ")
    
    
    if(!reason) {
      return message.channel.send("Veuillez donner une raison pour mute cette personne.")
    }
    
  //TIME TO LET MUTED ROLE
    
    let muterole = message.guild.roles.cache.find(x => x.name === "Mute")
    
    
      if(!muterole) {
      return message.channel.send("This server do not have role with name `Muted`")
    }
    
    
   if(user.roles.cache.has(muterole)) {
      return message.channel.send("Cet utilisateur est déjà mute !")
    }
    
  
    
    
    user.roles.add(muterole)
    
await message.channel.send(`Vous avez mute **${message.mentions.users.first().username}** pour \`${reason}\``).then(msg => {
  setTimeout(() => {
    msg.delete();
  }, 5000)
})
let embed = new discord.MessageEmbed()
  .setTitle("Action: Mute")
  .setDescription(`${user} (${user.id}) a été mute pour ${reason}.`)
  .setColor("#ff2050")
  .setFooter(`Mute par ${message.author.username}`);
    

client.channels.cache.get(db.get(`logschannel_${message.guild.id}`)).send({embed: embed }) // Envoie de l'embed final dans le channel de LOG
    
user.send(`Vous avez été mute dans **${message.guild.name}** par ${message.author.username} pour \`${reason}\``)

    
//WE ARE DONE HERE 
    
  }
};

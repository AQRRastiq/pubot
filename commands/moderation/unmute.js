module.exports = {
  name: "unmute",
  category: "moderation",
  description: "Démute quelqu'un",
  usage: "unmute <@utilisateur>",
  run: async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_ROLES")) {
      return message.channel.send(
        "Vous ne passerez pas ! (Vous n'avez pas la permission d'unmute quelqu'un.)"
      );
    }

    if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
      return message.channel.send("I do not have permission to manage roles.");
    }

    const user = message.mentions.members.first();

    if (!user) {
      return message.channel.send(
        "Veuillez mentionner la personne que vous voulez unmute"
      );
    }
    
    let muterole = message.guild.roles.cache.find(x => x.name === "Mute")
    
    if(user.roles.cache.has(muterole)) {
      return message.channel.send("Cet utilisateur n'est pas mute !")
    }
    
    
    user.roles.remove(muterole)
    
    await message.channel.send(`Vous avez démute **${message.mentions.users.first().username}** pour \`${reason}\``).then(msg => {
      setTimeout(() => {
        msg.delete();
      }, 5000)
    })
    let embed = new discord.MessageEmbed()
      .setTitle("Action: UnMute")
      .setDescription(`${user} (${user.id}) a été démute pour ${reason}.`)
      .setColor("#ff2050")
      .setFooter(`UnMute par ${message.author.username}`);
        
    
    client.channels.cache.get('835780445475307544').send({embed: embed }) // Envoie de l'embed final dans le channel de LOG
        
    user.send(`Vous avez été démute dans **${message.guild.name}** par ${message.author.username}`)

  }
};

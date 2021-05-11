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
    
    await message.channel.send(`**${message.mentions.users.first().username}** n'est plus mute`)
    
    user.send(`Vous êtes maintenant unmute dans **${message.guild.name}**`)

  }
};

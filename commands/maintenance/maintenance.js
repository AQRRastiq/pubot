const { MessageEmbed } = require("discord.js")
const db = require("quick.db")
const discord = require('discord.js');

module.exports = {
  name: "maintenance",
  category: "maintenance",
  usage: "maintenance",
  description: "Ouvrir le menu de maintenance",
  run: async (client, message, args) => {
    message.delete();
    if (!args[0]) {
      message.channel.send(new MessageEmbed()
        .setTitle("Menu de maintenance")
        .setColor("#ff9600")
        .setDescription("Pour lancer une maintenance, écrivez \"r!maintenance start\" et pour arrêter la maintenance, écrivez \"r!maintenance stop\" ! Ce message se supprimera automatiquement dans 30 secondes."))
    }
    else {

      if (args[0] === "start") {
        const maintenancerole = message.guild.roles.cache.find(role => role.name === "Maintenance");
        if (!maintenancerole) return message.channel.send(':x: Aucun rôle de maintenance trouvé !')

        message.guild.members.cache.forEach(member => {
          member.roles.add(maintenancerole.id)

        })

        const embed = new MessageEmbed()
          .setTitle("Maintenance activée !")
          .setColor("#ff9600")
          .setDescription("Le mode maintenance est maintenant activé dans le serveur " + message.guild.name + " !")
        await message.channel.send(embed);
        client.channels.cache.get('835780445475307544').send(embed)
      } // Envoie de l'embed final dans le channel de LOG
      if (args[0] === "stop") {
        const maintenancerole = message.guild.roles.cache.find(role => role.name === "Maintenance");
        if (!maintenancerole) return message.channel.send(':x: Aucun rôle de maintenance trouvé !')
        message.guild.members.cache.forEach(member => {
          member.roles.remove(maintenancerole.id)
        })

        const embed = new MessageEmbed()
          .setTitle("Maintenance désactivée !")
          .setColor("#ff9600")
          .setDescription("Le mode maintenance est maintenant désactivé dans le serveur " + message.guild.name + " !")
        await message.channel.send(embed);
        client.channels.cache.get('835780445475307544').send(embed)
      } // Envoie de l'embed final dans le channel de LOG





    }
  }
}





const { MessageAttachment } = require('discord.js');
const canvacord = require("canvacord");
module.exports = {
  name: "avatar",
  description: "Avoir l'avatar de quelqu'un",
  usage: "avatar @mention",
  category: "info",
  run: async (client, message, args) => {
    let user = message.mentions.users.first() || message.author;
    let avatar = user.displayAvatarURL({ format: "png", dynamic: false });
    message.channel.send(`Voici l'avatar de <@${user.id}>`);
    message.channel.send(avatar + "?size=1024");
    }
}
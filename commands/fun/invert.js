
const { MessageAttachment } = require('discord.js');
const canvacord = require("canvacord");
module.exports = {
  name: "invert",
  description: "Couleurs inversées sur une image",
  usage: "invert <lien d'image>",
  category: "fun",
  run: async (client, message, args) => {
    let user = message.mentions.users.first() || message.author;
    let invert = await canvacord.Canvas.invert(user.displayAvatarURL({format: 'png', dynamic: false}));
    let attachment = new MessageAttachment(invert, "invert.png");
    return message.channel.send(attachment);
    }
}
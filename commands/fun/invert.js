
const { MessageAttachment } = require('discord.js');
const canvacord = require("canvacord");
module.exports = {
  name: "invert",
  description: "Couleurs inversées sur une image",
  usage: "invert <lien d'image>",
  category: "fun",
  run: async (client, message, args) => {
    let user = args[0];
    let invert = await canvacord.Canvas.invert(user);
    let attachment = new MessageAttachment(invert, "invert.png");
    return message.channel.send(attachment);
    }
}
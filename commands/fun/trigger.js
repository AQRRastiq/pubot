
const { MessageAttachment } = require('discord.js');
const canvacord = require("canvacord");
module.exports = {
  name: "trigger",
  description: "Effet trigger sur une image",
  usage: "trigger <utilisateur>",
  category: "fun",
  run: async (client, message, args) => {
    let user = message.mentions.users.first() || message.author;
    let triggered = await canvacord.Canvas.trigger(user.displayAvatarURL({ format: "png", dynamic: false }));
    let attachment = new MessageAttachment(triggered, "triggered.gif");
    return message.channel.send(attachment);
    }
}
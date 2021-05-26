
const { MessageAttachment, MessageEmbed } = require('discord.js');
const canvacord = require("canvacord");
module.exports = {
  name: "triggered",
  description: "Effet trigger sur une image",
  usage: "triggered <utilisateur>",
  category: "fun",
  run: async (client, message, args) => {
    let user = message.mentions.users.first() || message.author;
    let triggered = await canvacord.Canvas.trigger(user.displayAvatarURL({format: 'png', dynamic: false}));
    let attachment = new MessageAttachment(triggered, "triggered.gif");
    return message.channel.send(attachment);
    
    
    }
}
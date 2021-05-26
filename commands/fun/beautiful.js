
const { MessageAttachment } = require('discord.js');
const canvacord = require("canvacord");
module.exports = {
  name: "beautiful",
  description: "Oh this ? This is beautiful.",
  usage: "beautiful <lien d'image>",
  category: "fun",
  run: async (client, message, args) => {
    let user = message.mentions.users.first() || message.author;
    let beautiful = await canvacord.Canvas.beautiful(user.displayAvatarURL({format: 'png', dynamic: false}));
    let attachment = new MessageAttachment(beautiful, "beautiful.png");
    return message.channel.send(attachment);
    }
}

const { MessageAttachment } = require('discord.js');
const canvacord = require("canvacord");
module.exports = {
  name: "beautiful",
  description: "Oh this ? This is beautiful.",
  usage: "beautiful <lien d'image>",
  category: "fun",
  run: async (client, message, args) => {
    let user = args[0]
    if (!user){
      return message.channel.send(":x: Vous devez mettre un lien d'image ! Si vous voulez avoir l'avatar de quelqu'un, faites p!avatar @mention.")
    }
    let beautiful = await canvacord.Canvas.beautiful(user);
    let attachment = new MessageAttachment(beautiful, "beautiful.png");
    return message.channel.send(attachment);
    }
}
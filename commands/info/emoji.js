const Discord = require("discord.js");
const { parse } = require("twemoji-parser");
module.exports = {
  name: "emoji",
  description: "Voir la version enlargée d'un emoji.",
  usage: "emoji <emoji>",
  category: "info",
  run: async (client, message, args) => {
    const emoji = args[0];
    if (!emoji) return message.channel.send("Aucun emoji fourni !");

    let custom = Discord.Util.parseEmoji(emoji);
    const embed = new Discord.MessageEmbed()
    .setTitle(`Version enlargée de ${emoji}`)
    .setColor("#FFFF00");

    if (custom.id) {
        embed.setImage(`https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? "gif" : "png"}`);
        return message.channel.send(embed);
    }
    else {
        let parsed = parse(emoji, { assetType: "png" });
        if (!parsed[0]) return message.channel.send("Emoji invalide !");

        embed.setImage(parsed[0].url);
        return message.channel.send(embed);
    }
  }
}
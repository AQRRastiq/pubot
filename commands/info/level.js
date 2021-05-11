const db = require('quick.db')
const discord = require('discord.js')
const { MessageAttachment } = require('discord.js');
const canvacord = require("canvacord");
module.exports = {
  name: "level",
  description: "Voir votre niveau ou celui d'une personne mentionée",
  usage: "level <utilisateur>",
  category: "info",
  run: async (client, message, args) => {
    let user = message.mentions.users.first() || message.author;

    let level = db.get(`level_${user.id}`) || 0;
    let exp = db.get(`xp_${user.id}`) || 0;
    let neededXP = Math.floor(Math.pow(level / 0.1, 2));

    let every = db.all().filter(i => i.ID.startsWith("xp_")).sort((a, b) => b.data - a.data);
    let rank = every.map(x => x.ID).indexOf(`xp_${user.id}`) + 1;

// v4 rank card
//   let img = await canvacord.rank({
//     username: user.username,
//     discrim: user.discriminator,
//     currentXP: exp.toString(),
//     neededXP: neededXP.toString(),
//     rank: rank.toString(),
//     level: level.toString(),
//     avatarURL: user.displayAvatarURL({ format: "png" }),
//     background: "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?ixlib=rb-1.2.1&w=1000&q=80"
//   });
  
  // v5 rank card
    const card = new canvacord.Rank()
      .setUsername(user.username)
      .setDiscriminator(user.discriminator)
      .setRank(rank)
      .setLevel(level)
      .setCurrentXP(exp)
      .setRequiredXP(neededXP)
      .setStatus(user.presence.status)
      .setAvatar(user.displayAvatarURL({ format: "png", size: 1024 }));

    const img = await card.build();
  
    return message.channel.send(new MessageAttachment(img, "rank.png"));
    }
}
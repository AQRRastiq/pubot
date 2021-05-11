const { MessageEmbed } = require("discord.js")
const db = require("quick.db")
const discord = require('discord.js');

module.exports = {
  name: "warn",
  category: "moderation",
  usage: "warn <@mention> <raison>",
  description: "Warn quelqu'un",
  run: async (client, message, args) => {
    
    if(!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send("Vous ne passerez pas ! (Vous n'avez pas la permission de warn quelqu'un !)")
    }
    
    const user = message.mentions.members.first()
    
    if(!user) {
      return message.channel.send("Veuillez mentionner la personne que vous voulez warn - warn @mention <raison>")
    }
    
    if(user.bot) {
      return message.channel.send("Vous ne pouvez pas warn de bots.")
    }
    
    if(message.author.id === user.id) {
      return message.channel.send("Vuos ne pouvez pas vous warn vous-même")
    }
    
    if(user.id === message.guild.owner.id) {
      return message.channel.send("Tu croyais vraiment pouvoir warn le créateur du serveur ? -_-")
    }
    
    const reason = args.slice(1).join(" ")
    
    if(!reason) {
      return message.channel.send("Veuillez spécifier une raison pour warn cette personne - warn @mention <raison>")
    }
    
    let warnings = db.get(`warnings_${message.guild.id}_${user.id}`)
    
    if(warnings === 3) {
      return message.channel.send(`${message.mentions.users.first().username} a déjà 3 warnings.`)
    }
    
    if(warnings === null) {
      db.set(`warnings_${message.guild.id}_${user.id}`, 1)
      user.send(`Vous avez été warn dans **${message.guild.name}** par ${message.author.username} pour ${reason}`)
      await message.channel.send(`Vous avez warn **${message.mentions.users.first().username}** pour ${reason}`)
    } else if(warnings !== null) {
        db.add(`warnings_${message.guild.id}_${user.id}`, 1)
       user.send(`Vous avez été warn dans **${message.guild.name}** par ${message.author.username} pour ${reason}`)
      await message.channel.send(`Vous avez warn **${message.mentions.users.first().username}** pour ${reason}`)
      if (db.get(`warnings_${message.guild.id}_${user.id}`) === 3) {
        message.channel.send("Cet utilisateur a maintenant 3 warnings ! Voulez vous le bannir ?").then(m => {
                  m.react('👍').then(r => {
                            m.react('👎');
                    });

                    // First argument is a filter function
                    m.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                            { max: 1, time: 30000 }).then(collected => {
                                    if (collected.first().emoji.name == '👍') {
                                            message.channel.send('En train de bannir cet utilisateur...');
                                            let embed = new discord.MessageEmbed()
     .setTitle("Action : Ban")
     .setDescription(`${user} (${user.id}) a été banni`)
     .setColor("#ff2050")
     .setThumbnail(user.avatarURL)
     .setFooter(`Banni pour avoir eu 3 warnings`);
    
   message.channel.send(embed)
   user.ban({ reason: "3 warnings" })
                                    }
                                    else
                                            message.channel.send('Opération annulée.');
                            }).catch(() => {
                                    message.channel.send('Pas de réaction, opération annulée.');
                            });
        })

      }
    }
    
  
  } 
}
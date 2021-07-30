const discord = require("discord.js");
const ms = require('ms');

module.exports = {
  name: "gnewwithrestrictions",
  category: "giveaways",
  description: "Créer un giveaway avec des restrictions",
  usage: "gnewwithrestrictions <#salon> <durée> <nombre de gagnants> <id de serveur à rejoindre> <prix>",
  run: async (client, message, args) => {
    if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.channel.send(':x: Vous ne passerez pas ! (Vous n\'avez pas la permission d\'utiliser cette commande)');
    }
    message.channel.send('Veuillez mentionner un salon !')
    message.channel.awaitMessages(m => m.author.id == message.author.id,
        {max: 1, time: 30000}).then(collected => {
                // only accept messages by the user who sent the command
                // accept only 1 message, and return the promise after 30000ms = 30s

                // first (and, in this case, only) message of the collection
                if (collected.first().mentions.channels.first()) {
                    giveawayChannel = collected.first().mentions.channels.first();
                    message.channel.send('Parfait ! Maintenant, veuillez envoyer une durée pour votre giveaway !');
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        {max: 1, time: 30000}).then(collected => {
                                // Giveaway duration
                                let giveawayDuration = collected.first().content;
                                // If the duration isn't valid
                                if(!giveawayDuration || isNaN(ms(giveawayDuration))){
                                    return message.channel.send(':x: Vous devez mentionner une durée valide ! Opération annulée !');
                                }
                                // only accept messages by the user who sent the command
                                // accept only 1 message, and return the promise after 30000ms = 30s
                
                                // first (and, in this case, only) message of the collection
                                message.channel.send('A présent, veuillez envoyer le nombre de gagnants pour votre giveaway !');
                                message.channel.awaitMessages(m => m.author.id == message.author.id,
                                    {max: 1, time: 30000}).then(collected => {
                                        // Number of winners
                                        let giveawayNumberWinners = collected.first().content;
                                        // If the specified number of winners is not a number
                                        if(isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)){
                                            return message.channel.send(':x: Vous devez mentionner un nombre de gagnants valide ! Opération annulée !');
                                        }
                                            // only accept messages by the user who sent the command
                                            // accept only 1 message, and return the promise after 30000ms = 30s
                            
                                            // first (and, in this case, only) message of the collection
                                            message.channel.send('Cette fois-ci, veuillez envoyer un id de serveur à rejoindre pour votre giveaway ! (Le bot doit être dans ce serveur !)');
                                            message.channel.awaitMessages(m => m.author.id == message.author.id,
                                                {max: 1, time: 30000}).then(collected => {
                                                        // only accept messages by the user who sent the command
                                                        // accept only 1 message, and return the promise after 30000ms = 30s
                                        
                                                        // first (and, in this case, only) message of the collection

                                                            ServerID = collected.first().mentions.channels.first();
                                                            message.channel.send('Dernièrement, veuillez envoyer un prix pour votre giveaway !');
                                                            message.channel.awaitMessages(m => m.author.id == message.author.id,
                                                                {max: 1, time: 30000}).then(collected => {
                                                                        // only accept messages by the user who sent the command
                                                                        // accept only 1 message, and return the promise after 30000ms = 30s
                                                        
                                                                        // first (and, in this case, only) message of the collection
                                                                        giveawayPrize = collected.first().content
                                                                        // Start the giveaway
    client.giveawaysManager.start(giveawayChannel, {
        // The giveaway duration
        time: ms(giveawayDuration),
        // The giveaway prize
        prize: giveawayPrize,
        // The giveaway winner count
        winnerCount: parseInt(giveawayNumberWinners),
        // Who hosts this giveaway
        hostedBy: client.config.hostedBy ? message.author : null,
        // Messages
        messages: {
            giveaway: (client.config.everyoneMention ? "@everyone\n\n" : "")+"🎉🎉 **GIVEAWAY** 🎉🎉",
            giveawayEnded: (client.config.everyoneMention ? "@everyone\n\n" : "")+"🎉🎉 **GIVEAWAY TERMINÉ** 🎉🎉",
            timeRemaining: "Temps restant: **{duration}**!",
            inviteToParticipate: "Réagissez avec 🎉 pour participer !",
            winMessage: "Bravo, {winners} ! Vous avez gagné **{prize}** !",
            embedFooter: "RastiqGiveaways",
            noWinner: "Giveaway annulé, pas assez de participations.",
            hostedBy: "Créé par {user}",
            winners: "gagnant(s)",
            endedAt: "Terminé à",
            exemptMembers: (member) => !client.guilds.cache.get(ServerID).member(member.id),
            units: {
                seconds: "secondes",
                minutes: "minutes",
                hours: "heures",
                days: "jours",
                pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
            },
            lastChance: {
                enabled: true,
                content: '⚠️ **DERNIERE CHANCE D\'ENTRER !** ⚠️',
                threshold: 20000,
                embedColor: '#FF0000'
            }
        }
    });

    message.channel.send(`Giveaway lancé dans ${giveawayChannel}!`);
    let embed = new discord.MessageEmbed()
        .setAuthor(message.member.user.username, message.member.user.displayAvatarURL({dynamic: true}))
        .setDescription(`${message.member} a lancé un giveaway avec le prix "${giveawayPrize}" !`)
        .addField("__Salon du giveaway :__", giveawayChannel, true)
        .setColor("#4EF20C")
  
                // On lance le compte à rebours
    setTimeout(function() {
            client.channels.cache.get('835780445475307544').send({embed: embed }) // Envoie de l'embed final dans le channel de LOG
    }, 5000)
                                                                            
   
                                                                }).catch((e) => {
                                                                    console.log(e)
                                                                        message.reply('Aucune réponse après 30 secondes, opération annulée.');
                                                                });
                                                                

                                        
   
                                                }).catch((e) => {
                                                    console.log(e)
                                                        message.reply('Aucune réponse après 30 secondes, opération annulée.');
                                                });
                                                    
                             
                                    }).catch((e) => {
                                        console.log(e)
                                            message.reply('Aucune réponse après 30 secondes, opération annulée.');
                                    });
                                         
                        }).catch((e) => {
                            console.log(e)
                                message.reply('Aucune réponse après 30 secondes, opération annulée.');
                        });  
                }

                else
                        message.reply('Aucun salon mentionné, opération annulée.');      
        }).catch((e) => {
            console.log(e)
                message.reply('Aucune réponse après 30 secondes, opération annulée.');
        });
    if (!message.author.id === "499297738370973716" || !message.author.id === "689089812669399076")
    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.channel.send(':x: Vous ne passerez pas ! (Vous n\'avez pas la permission d\'utiliser cette commande)');
    }

    

    

    
  }
}
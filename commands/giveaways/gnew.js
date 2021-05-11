const discord = require("discord.js");
const ms = require('ms');

module.exports = {
  name: "gnew",
  category: "giveaways",
  description: "Créer un giveaway",
  usage: "gnew <#salon> <durée> <nombre de gagnants> <prix>",
  run: async (client, message, args) => {
    if (message.guild) {

    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.channel.send(':x: Vous n\'avez pas la permission d\'exécuter cette commande.');
    }

    // Giveaway channel
    const giveawayChannel = message.mentions.channels.first();
    // If no channel is mentionned
    if(!giveawayChannel){
        return message.channel.send(':x: Vous devez mentionner un salon valide!');
    }

    // Giveaway duration
    let giveawayDuration = args[1];
    // If the duration isn't valid
    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
        return message.channel.send(':x: Vous devez spécifier une durée valide!');
    }

    // Number of winners
    let giveawayNumberWinners = args[2];
    // If the specified number of winners is not a number
    if(isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)){
        return message.channel.send(':x: Vous devez spécifier un nombre de gagnant valide!');
    }

    // Giveaway prize
    let giveawayPrize = args.slice(3).join(' ');
    // If no prize is specified
    if(!giveawayPrize){
        return message.channel.send(':x: Vous devez spécifier un prix valide!');
    }

    // Start the giveaway
    client.giveawaysManager.start(giveawayChannel, {
        // The giveaway duration
        time: ms(giveawayDuration),
        // The giveaway prize
        prize: giveawayPrize,
        // The giveaway winner count
        winnerCount: giveawayNumberWinners,
        // Who hosts this giveaway
        hostedBy: message.author,
        // Messages
        messages: {
            giveaway: ("@everyone\n\n")+"🎉🎉 **GIVEAWAY** 🎉🎉",
            giveawayEnded: ("@everyone\n\n")+"🎉🎉 **GIVEAWAY TERMINÉ** 🎉🎉",
            timeRemaining: "Temps restant: **{duration}**!",
            inviteToParticipate: "Réagissez avec 🎉 pour participer!",
            winMessage: "Bravo, {winners}! Tu(Vous) as(avez) gagné **{prize}**!",
            embedFooter: "PuBot Giveaways",
            noWinner: "Giveaway annulé, pas assez de participations.",
            hostedBy: "Créé par: {user}",
            winners: "Gagnant(s)",
            endedAt: "Terminé à",
            units: {
                seconds: "secondes",
                minutes: "minutes",
                hours: "heures",
                days: "jours",
                pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
            }
        }
    })}else{
        return message.channel.send('Vous ne pouvez pas exécuter cette commande en DM')
    };
    

    message.channel.send(`Giveaway créé dans ${args[0]}`);
  }
}
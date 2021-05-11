const discord = require("discord.js");
const ms = require('ms');

module.exports = {
  name: "greroll",
  category: "giveaways",
  description: "Regénérer un nouveau gagnant",
  usage: "greroll <id de giveaway>",
  run: async (client, message, args) => {
    if(message.guild){

    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.channel.send(':x: Vous n\'avez pas la permission d\'exécuter cette commande.');
    }

    // If no message ID or giveaway name is specified
    if(!args[0]){
        return message.channel.send(':x: Vous devez spécifier un ID de message valide!');
    }

    // try to found the giveaway with prize then with ID
    let giveaway = 
    // Search with giveaway prize
    client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    // Search with giveaway ID
    client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    // If no giveaway was found
    if(!giveaway){
        return message.channel.send('Impossible de trouver un giveaway pour `'+ args.join(' ') +'`.');
    }

    // Reroll the giveaway
    client.giveawaysManager.reroll(giveaway.messageID)
    .then(() => {
        // Success message
        message.channel.send('Giveaway reroll!');
    })
    .catch((e) => {
        if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)){
            message.channel.send('Ce giveaway n\'est pas terminé!');
        } else {
            console.error(e);
            message.channel.send('Il y a eu une erreur...');
        }
    })}else{
        return message.channel.send('Vous ne pouvez pas exécuter cette commande en DM');
    }
  }
}
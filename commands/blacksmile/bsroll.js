const db = require("quick.db");
const { MessageEmbed } = require('discord.js');
const rolled = new Set();

module.exports = {
  name: "bsroll",
  description: "Tenter de gagner un prix avec la roulette !",
  category: "blacksmile",
  run: async (client, message, args) => {
      
  let results = [
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu n'as rien gagné ! Réassaye plus tard !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un rôle premium ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un salon personnalisé pendant 1 semaine ! Bravo ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un salon personnalisé pendant 1 semaine ! Bravo ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un salon personnalisé pendant 1 semaine ! Bravo ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un salon personnalisé pendant 1 semaine ! Bravo ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un salon personnalisé pendant 1 semaine ! Bravo ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un salon personnalisé pendant 1 semaine ! Bravo ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un salon personnalisé pendant 1 semaine ! Bravo ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un salon personnalisé pendant 1 semaine ! Bravo ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un salon personnalisé pendant 1 semaine + une mention annonce ! Bravo ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
    "Tu as gagné un salon personnalisé pendant 1 semaine + une mention annonce ! Bravo ! Prend une capture de ce message, crée un ticket et envoie la photo pour réclamer ton prix !",
];
let prix = results[Math.floor(Math.random() * results.length)]
message.channel.send(new MessageEmbed()
.setColor('#34eb46')
.setTitle('Roulette')
.setDescription('Ça tourne...')).then(msg => {
  setTimeout(() => {
    msg.edit(new MessageEmbed()
    .setColor('#34eb46')
    .setTitle('Roulette')
    .setDescription(`${message.author}, ` + prix))
  }, 5000)
})


    
}
  }

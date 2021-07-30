const { token, default_prefix, interserver } = require("./config.json");
const rolled = new Set();
const { badwords, ccwords, rbot } = require("./data.json") 
require('dotenv').config();
const discord = require("discord.js");
//Gonna use Discord.js Module xD
const client = new discord.Client({disableEveryone: true, ws: { intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_PRESENCES'] }, partials: ['MESSAGE']});

const maxMessageCount = parseInt(5);
let lastStickyMessage = "";
let messageCount = 0;
let stickyMessageChannel = "";
let stickyMessageContent = "";
const config = require('./config.json');
client.config = config;
const fs = require('fs');
const db = require("quick.db"); //WE WILL BE USING QUICK.DB
const { addexp } = require("./handlers/xp.js");
client.commands = new discord.Collection();
client.aliases = new discord.Collection();
client.cooldown = new discord.Collection();
client.config = {
  "cooldown": 5
}
const Enmap = require("enmap");
client.stats = new Enmap({name :"stats", dataDir: "./databases/stats"})
client.settings = new Enmap({name :"settings", dataDir: "./databases/settings"})
const { createCanvas } = require('canvas');

const { CanvasSenpai } = require("canvas-senpai")
const canva = new CanvasSenpai();
const emojis = JSON.parse(fs.readFileSync('emojis.json', 'utf8'));

const { GiveawaysManager } = require("discord-giveaways");
if(!db.get("giveaways")) db.set("giveaways", []);

const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {

    // This function is called when the manager needs to get all the giveaway stored in the database.
    async getAllGiveaways(){
        // Get all the giveaway in the database
        return db.get("giveaways");
    }

    // This function is called when a giveaway needs to be saved in the database (when a giveaway is created or when a giveaway is edited).
    async saveGiveaway(messageID, giveawayData){
        // Add the new one
        db.push("giveaways", giveawayData);
        // Don't forget to return something!
        return true;
    }

    async editGiveaway(messageID, giveawayData){
        // Gets all the current giveaways
        const giveaways = db.get("giveaways");
        // Remove the old giveaway from the current giveaways ID
        const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID);
        // Push the new giveaway to the array
        newGiveawaysArray.push(giveawayData);
        // Save the updated array
        db.set("giveaways", newGiveawaysArray);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a giveaway needs to be deleted from the database.
    async deleteGiveaway(messageID){
        // Remove the giveaway from the array
        const newGiveawaysArray = db.get("giveaways").filter((giveaway) => giveaway.messageID !== messageID);
        // Save the updated array
        db.set("giveaways", newGiveawaysArray);
        // Don't forget to return something!
        return true;
    }

};

// Create a new instance of your new class
const manager = new GiveawayManagerWithOwnDatabase(client, {
    storage: false,
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        exemptPermissions: [ "MANAGE_MESSAGES", "ADMINISTRATOR" ],
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});
client.giveawaysManager = manager;
// We now have a client.giveawaysManager property to manage our giveaways!

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} unreact to giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
  //When bot is ready
  client.user.setActivity('AQR_Rastiq#0001 | r!help', ({type: "WATCHING"}))
  console.log("I am Reday to Go");
});


//IS URL FUNCTION - START

function is_url(str) {
  let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if(regexp.test(str)) {
    return true;
  } else {
    return false;
  }
  
}

//FINISH


//STOP
client.on("message", async message => {
  if (message.author.bot) return; 
  
    if(message.content === `r!verify`) { // Si le membre envoie ce message, alors on continue :
      if (message.channel.name === "verif") {


      message.delete() // Suppression du message du membre (afin d'éviter de poluer le channel)



          const code = require("randomstring").generate({
              length: 6,
              charset: "alphanumeric",
              capitalization: "uppercase"
          })
          /*
              Ce code permet de générer le code du Captcha, par le biai d'un module, tout simple d'utilisation
          */
  
          const canvas = createCanvas(700, 250); // Instanciation du Canvas
          const ctx = canvas.getContext('2d');
  

  
          ctx.font = '60px Karmatic Arcade'; // Ceci permet de récupérer la police (voir le README pour voir comment l'obtenir)
          ctx.fillStyle = '#ffffff'; // Couleur du texte
          ctx.fillText(code, canvas.width / 7, canvas.height / 1.8); // Ajout du code sur le canvas, avec la couleur et la police défnie
  
          const attachment = new discord.MessageAttachment(canvas.toBuffer(), 'canvas.png'); // Création de l'image, qui sera ajoutée sur l'embed
  
          /*
          Je vous explique pas les champs de l'EMBED ci-dessous !
              Si vous ne connaissez pas :
              --> Documentation : https://discord.js.org/#/docs/main/stable/class/MessageEmbed
          */
          let embed = new discord.MessageEmbed()
              .setTitle("Vérification")
              .setDescription(`${message.member} ! Pour avoir accès à l'**entièreté** du serveur, vous devez passer la vérification ci-dessous ! \n\n__Comment ?__ \n> Il suffit simplement d'envoyer **EN DM** le code que vous voyez sur l'image ci-dessous ! \n\n:warning: Vous avez **30 secondes** pour répondre !`)
              .attachFiles(attachment)
              .setImage("attachment://canvas.png")
              .setColor("#FA0000")
              .setFooter("Le code doit être renvoyé en MAJUSCULES !")

          await message.channel.send({embed: embed}).then(async (captcha) => {

              captcha.delete({ timeout: 30000 }) // Suppression de l'embed au bout de 30 secondes, puisque le membre aura 30 secondes pour passer la vérification, une fois le message envoyé !

              const filter = m => m.author.id === message.author.id && m.channel.id === message.channel.id 
              
              /*
              Ce filtre permet de "bloquer" la réponse
                  --> m.author.id === message.author.id : le code doit être envoyé par le membre ayant envoyé le message
                  --> m.channel.id === message.channel.id ! le code doit être envoyé par le membre dans le même channel que celui du message
              */

              message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: [ 'time' ] }) // Création du collecteur, c'est qui fera office de récépteur du captcha une fois envoyé 
              .then((collected) => {

                  if(collected.first().content === code) { // Si le contenu du message envoyé par le membre correspond au code, alors on continue :

                      collected.first().delete({timeout: 3000}) // Suppression du message (3 secondes)
                      message.channel.send(":white_check_mark: ┊ Félicitations ! **Vous avez entré le bon code !**").then((m) => m.delete({ timeout: 5000 })) // Envoie d'un message dans le channel afin d'afficher que le membre à réussi le captcha, puis suppression du message (5 secondes)
                      message.member.roles.add(message.guild.roles.cache.get('835780444770533442')) // Ajout du rôle définit dans les 'settings' au membre
                      
                      let embed_valide = new discord.MessageEmbed()
                          .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                          .setDescription(`${message.member} a réussi le Captcha !`)
                          .addField("__Rôle ajouté :__", message.guild.roles.cache.get('835780444770533442'), true)
                          .addField("__Code du Captcha :__", code, true)
                          .setColor("#4EF20C")

                      client.channels.cache.get(db.get(`logschannel_${message.guild.id}`)).send({embed: embed_valide }) // Envoie de l'embed final dans le channel de LOG

                      // Pareil je ne vous explique pas les champs de l'embed ci-dessus, voir les lignes précédentes pour obtenir le lien de la documentation

                  } else {
                      collected.first().delete({timeout: 3000})
                      message.channel.send(":x: ┊ Nope ! **Vous n'avez pas entré le bon code !** \nVous allez être expulsé dans 5 secondes !").then((m) => m.delete({ timeout: 4750 })) // Si le membre n'envoie pas le bon code, alors on envoie un message, qui sera supprimé, puis le BOT essaie d'expulser l'utilisation
                      
                      // Création de l'embed :
                      let embed_false = new discord.MessageEmbed()
                          .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                          .setDescription(`${message.member} n'a pas réussi le Captcha !`)
                          .addField("__Code du Captcha :__", code, true)
                          .addField("__Code envoyé :__", collected.first().content, true)
                          .setColor("#FA0000")

                      // On lance le compte à rebours
                      setTimeout(function() {
                          if(message.member.kickable) { // Vérification si le membre peut être expulsé
                              message.member.kick() // Si le BOT peut, alors il l'expulse
                              embed_false.addField("__Expulsé :__", "**OUI**", true) // On ajoute un champ à l'embed
                          } else {
                              message.channel.send(`Impossible d'expulser cet utilisateur \nMerci de vérifier que la position de **mon rôle** est à la plus haute position dans la hiérarchie !`).then((m) => m.delete({ timeout: 5000}))
                              embed_false.addField("__Expulsé :__", "**NON**", true)
                              // Le cas échéant (le membre ne peut être expulsé), le bot envoie un message, le supprime, et ajoute un champ à l'embed
                          }
                          client.channels.cache.get(db.get(`logschannel_${message.guild.id}`)).send({embed: embed_false }) // Envoie de l'embed final dans le channel de LOG
                      }, 5000)
                  }
              })
              .catch((collected) => {
                  message.channel.send(`:x: ┊ Le temps **est écoulé** !`).then((m) => m.delete({ timeout: 4700 })) // Si le membre n'envoie pas le code dans le temps donné (ici, 30 secondes), alors le BOT envoie ce message, puis le supprime
                  
                  // Création de l'embed :
                  let embed_false = new discord.MessageEmbed()
                      .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                      .setDescription(`${message.member} **n'a pas réussi le Captcha à temps !**`)
                      .setColor("#FA0000")

                  // Véfication si le membre peut être expulsé, et ajouts des champs à l'Embed
                  if(message.member.kickable) {
                      message.member.kick()
                      embed_false.addField("__Expulsé :__", "**OUI**", true)
                  } else {
                      message.channel.send(`Impossible d'expulser cet utilisateur \nMerci de vérifier que la position de **mon rôle** est à la plus haute position dans la hiérarchie !`).then((m) => m.delete({ timeout: 5000}))
                      embed_false.addField("__Expulsé :__", "**NON**", true)
                  }

                  client.channels.cache.get(db.get(`logschannel_${message.guild.id}`)).send({embed: embed_false })
              })
          })}
      

  }

  if (message.channel.id === "835780444971728920") {
    if (message.content === "r!regles") {
      message.member.roles.add('843074189228900392')
    }
    message.delete();
  }


  if(!message.member.hasPermission("ADMINISTRATOR")) {
    
    if(is_url(message.content) === true) {
      if(!message.channel.id === "835780445307142168") {
        message.delete()
        return message.channel.send("Tu ne peux pas envoyer de liens ici :/")
      }
    }
    
    
    
    
    
    let confirm = false;
    //NOW WE WILL USE FOR LOOP
    var i;
    for(i = 0;i < badwords.length; i++) {
      
      if(message.content.toLowerCase().includes(badwords[i].toLowerCase()))
        confirm = true;
      
    }
    
    if(confirm) {
      message.delete()
      return message.channel.send("Tu n'as pas le droit d'envoyer des gros mots ici :/")
    }} 
    let ccconfirm = false;
    //NOW WE WILL USE FOR LOOP
    var i;
    for(i = 0;i < ccwords.length; i++) {
      
      if(message.content.toLowerCase().includes(ccwords[i].toLowerCase()))
        ccconfirm = true;
      
    }
    
    if(ccconfirm) {
      message.react('👋')
    }   
    let rconfirm = false;
    //NOW WE WILL USE FOR LOOP
    var i;
    for(i = 0;i < rbot.length; i++) {
      
      if(message.content.toLowerCase().includes(rbot[i].toLowerCase()))
        rconfirm = true;
      
    }
    
    if(rconfirm) {
      message.react('👀')
    }

    if (message.channel.id === "852254183112310834") {
      client.channels.cache.get("860060652815384577").send(new discord.MessageEmbed()
      .setTitle('Message interserveur')
      .setDescription('Message : ' + message.content)
      .setFooter('Message de ' + message.author.username + '#' + message.author.discriminator + ' dans le serveur "' + message.guild.name + '"')
      .setColor('#32ffff'))
      client.channels.cache.get("859066780655157278").send(new discord.MessageEmbed()
      .setTitle('Message interserveur')
      .setDescription('Message : ' + message.content)
      .setFooter('Message de ' + message.author.username + '#' + message.author.discriminator + ' dans le serveur "' + message.guild.name + '"')
      .setColor('#32ffff'))
    }

    if (message.channel.id === "860060652815384577") {
      client.channels.cache.get("852254183112310834").send(new discord.MessageEmbed()
      .setTitle('Message interserveur')
      .setDescription('Message : ' + message.content)
      .setFooter('Message de ' + message.author.username + '#' + message.author.discriminator + ' dans le serveur "' + message.guild.name + '"')
      .setColor('#32ffff'))
      client.channels.cache.get("859066780655157278").send(new discord.MessageEmbed()
      .setTitle('Message interserveur')
      .setDescription('Message : ' + message.content)
      .setFooter('Message de ' + message.author.username + '#' + message.author.discriminator + ' dans le serveur "' + message.guild.name + '"')
      .setColor('#32ffff'))
    }

    if (message.channel.id === "859066780655157278") {
      client.channels.cache.get("852254183112310834").send(new discord.MessageEmbed()
      .setTitle('Message interserveur')
      .setDescription('Message : ' + message.content)
      .setFooter('Message de ' + message.author.username + '#' + message.author.discriminator + ' dans le serveur "' + message.guild.name + '"')
      .setColor('#32ffff'))
      client.channels.cache.get("860060652815384577").send(new discord.MessageEmbed()
      .setTitle('Message interserveur')
      .setDescription('Message : ' + message.content)
      .setFooter('Message de ' + message.author.username + '#' + message.author.discriminator + ' dans le serveur "' + message.guild.name + '"')
      .setColor('#32ffff'))
    }
    
  

  if (message.channel.id === "769235352317460511") {
    

    message.channel.send(new discord.MessageEmbed()
      .setTitle("Black Smile | 100% PUB")
      .setColor("#ff0000")
      .setDescription("Si vous quittez le serveur, vos publicités seront **supprimées**. \n**Respectez** les **règles publicitaires** du serveur. \n**Slowmode** de **2h**. \n**L'Équipe du Staff** vous **remercie** de** Pub** sur notre serveur !")
      .setThumbnail('https://aqrrastiq.tk/cdn/images/blacksmile.png')).then(async m => {
        db.set(`laststickyid_${message.author.id}_${message.channel.id}`, m.id);
      })
  }
  if (message.channel.id === "769235390837162015") {
    

    message.channel.send(new discord.MessageEmbed()
      .setTitle("Black Smile | 100% PUB")
      .setColor("#ff0000")
      .setDescription("Si vous quittez le serveur, vos publicités seront **supprimées**. \n**Respectez** les **règles publicitaires** du serveur. \n**Slowmode** de **2h**. \n**L'Équipe du Staff** vous **remercie** de** Pub** sur notre serveur !")
      .setThumbnail('https://aqrrastiq.tk/cdn/images/blacksmile.png')).then(async m => {
        db.set(`laststickyid_${message.author.id}_${message.channel.id}`, m.id);
      })
  }
  if (message.channel.id === "769234831946285086") {
    

    message.channel.send(new discord.MessageEmbed()
      .setTitle("Black Smile | 100% PUB")
      .setColor("#ff0000")
      .setDescription("Si vous quittez le serveur, vos publicités seront **supprimées**. \n**Respectez** les **règles publicitaires** du serveur. \n**Slowmode** de **2h**. \n**L'Équipe du Staff** vous **remercie** de** Pub** sur notre serveur !")
      .setThumbnail('https://aqrrastiq.tk/cdn/images/blacksmile.png')).then(async m => {
        db.set(`laststickyid_${message.author.id}_${message.channel.id}`, m.id);
      })
  }
  if (message.channel.id === "769234889043345439") {
    

    message.channel.send(new discord.MessageEmbed()
      .setTitle("Black Smile | 100% PUB")
      .setColor("#ff0000")
      .setDescription("Si vous quittez le serveur, vos publicités seront **supprimées**. \n**Respectez** les **règles publicitaires** du serveur. \n**Slowmode** de **2h**. \n**L'Équipe du Staff** vous **remercie** de** Pub** sur notre serveur !")
      .setThumbnail('https://aqrrastiq.tk/cdn/images/blacksmile.png')).then(async m => {
        db.set(`laststickyid_${message.author.id}_${message.channel.id}`, m.id);
      })
  }
  if (message.channel.id === "769234920227995650") {
    

    message.channel.send(new discord.MessageEmbed()
      .setTitle("Black Smile | 100% PUB")
      .setColor("#ff0000")
      .setDescription("Si vous quittez le serveur, vos publicités seront **supprimées**. \n**Respectez** les **règles publicitaires** du serveur. \n**Slowmode** de **2h**. \n**L'Équipe du Staff** vous **remercie** de** Pub** sur notre serveur !")
      .setThumbnail('https://aqrrastiq.tk/cdn/images/blacksmile.png')).then(async m => {
        db.set(`laststickyid_${message.author.id}_${message.channel.id}`, m.id);
      })
  }
  if (message.channel.id === "769234950133514292") {
    

    message.channel.send(new discord.MessageEmbed()
      .setTitle("Black Smile | 100% PUB")
      .setColor("#ff0000")
      .setDescription("Si vous quittez le serveur, vos publicités seront **supprimées**. \n**Respectez** les **règles publicitaires** du serveur. \n**Slowmode** de **2h**. \n**L'Équipe du Staff** vous **remercie** de** Pub** sur notre serveur !")
      .setThumbnail('https://aqrrastiq.tk/cdn/images/blacksmile.png')).then(async m => {
        db.set(`laststickyid_${message.author.id}_${message.channel.id}`, m.id);
      })
  }
  if (message.channel.id === "769235025358094366") {
    

    message.channel.send(new discord.MessageEmbed()
      .setTitle("Black Smile | 100% PUB")
      .setColor("#ff0000")
      .setDescription("Si vous quittez le serveur, vos publicités seront **supprimées**. \n**Respectez** les **règles publicitaires** du serveur. \n**Slowmode** de **2h**. \n**L'Équipe du Staff** vous **remercie** de** Pub** sur notre serveur !")
      .setThumbnail('https://aqrrastiq.tk/cdn/images/blacksmile.png')).then(async m => {
        db.set(`laststickyid_${message.author.id}_${message.channel.id}`, m.id);
      })
  }
  if (message.channel.id === "769235126068314142") {
    

    message.channel.send(new discord.MessageEmbed()
      .setTitle("Black Smile | 100% PUB")
      .setColor("#ff0000")
      .setDescription("Si vous quittez le serveur, vos publicités seront **supprimées**. \n**Respectez** les **règles publicitaires** du serveur. \n**Slowmode** de **2h**. \n**L'Équipe du Staff** vous **remercie** de** Pub** sur notre serveur !")
      .setThumbnail('https://aqrrastiq.tk/cdn/images/blacksmile.png')).then(async m => {
        db.set(`laststickyid_${message.author.id}_${message.channel.id}`, m.id);
      })
  }
  if (message.channel.id === "769235710162108447") {
    

    message.channel.send(new discord.MessageEmbed()
      .setTitle("Black Smile | 100% PUB")
      .setColor("#ff0000")
      .setDescription("Si vous quittez le serveur, vos publicités seront **supprimées**. \n**Respectez** les **règles publicitaires** du serveur. \n**Slowmode** de **2h**. \n**L'Équipe du Staff** vous **remercie** de** Pub** sur notre serveur !")
      .setThumbnail('https://aqrrastiq.tk/cdn/images/blacksmile.png')).then(async m => {
        db.set(`laststickyid_${message.author.id}_${message.channel.id}`, m.id);
      })
  }
  if (message.channel.id === "769235741560537109") {
    

    message.channel.send(new discord.MessageEmbed()
      .setTitle("Black Smile | 100% PUB")
      .setColor("#ff0000")
      .setDescription("Si vous quittez le serveur, vos publicités seront **supprimées**. \n**Respectez** les **règles publicitaires** du serveur. \n**Slowmode** de **2h**. \n**L'Équipe du Staff** vous **remercie** de** Pub** sur notre serveur !")
      .setThumbnail('https://aqrrastiq.tk/cdn/images/blacksmile.png')).then(async m => {
        db.set(`laststickyid_${message.author.id}_${message.channel.id}`, m.id);
      })
  }
  if (message.channel.id === "769235792844947526") {
    

    message.channel.send(new discord.MessageEmbed()
      .setTitle("Black Smile | 100% PUB")
      .setColor("#ff0000")
      .setDescription("Si vous quittez le serveur, vos publicités seront **supprimées**. \n**Respectez** les **règles publicitaires** du serveur. \n**Slowmode** de **2h**. \n**L'Équipe du Staff** vous **remercie** de** Pub** sur notre serveur !")
      .setThumbnail('https://aqrrastiq.tk/cdn/images/blacksmile.png')).then(async m => {
        db.set(`laststickyid_${message.author.id}_${message.channel.id}`, m.id);
      })
  }
  if (message.channel.id === "769235828236484638") {
    

    message.channel.send(new discord.MessageEmbed()
      .setTitle("Black Smile | 100% PUB")
      .setColor("#ff0000")
      .setDescription("Si vous quittez le serveur, vos publicités seront **supprimées**. \n**Respectez** les **règles publicitaires** du serveur. \n**Slowmode** de **2h**. \n**L'Équipe du Staff** vous **remercie** de** Pub** sur notre serveur !")
      .setThumbnail('https://aqrrastiq.tk/cdn/images/blacksmile.png')).then(async m => {
        db.set(`laststickyid_${message.author.id}_${message.channel.id}`, m.id);
      })
  }
  
  //END
  if (!message.guild) return;
  let prefix = db.get(`prefix_${message.guild.id}`);
  if (prefix === null) prefix = default_prefix;

  if (!message.content.startsWith(prefix)) return;

  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

let cmdx = db.get(`cmd_${message.guild.id}`)

if(cmdx) {
  let cmdy = cmdx.find(x => x.name === cmd)
  if(cmdy) message.channel.send(cmdy.responce)
}

  // Get the command
  let command = client.commands.get(cmd);
  // If none is found, try to find it by alias
  if (!command) command = client.commands.get(client.aliases.get(cmd));



  // If a command is finally found, run the command
  if (command){
    command.run(client, message, args);
  }
  return xp(message);
}); //All codes link in description

//GONNA USE EVENT HERE

client.on("guildMemberAdd", async member => {
  if (!db.get('mtnid_' + member.guild.id) === null) member.roles.add(db.get('mtnid_' + message.guild.id))
  if (member.guild.id === "846194000275832832") {
    member.roles.add('846631259060437022')
  }
  if (member.guild.id === "769230794736009257") {
    client.channels.cache.get('769237120996737065').send(`Hey ${member} !`).then(msg => {
      setTimeout(() => {
        msg.delete();
      }, 5000)
    })
    client.channels.cache.get('769238166803841025').send(`Hey ${member} !`).then(msg => {
      setTimeout(() => {
        msg.delete();
      }, 5000)
    })
  }
  if (member.server.id === "859014722388099102") chx = "859396330799366144";
  else if (member.server.id === "769230794736009257") chx = "769277652695384094";
  else if (member.server.id === "835780444770533437") chx = "835944491861016646";
  if (chx === null) return;


  const Jimp = require('jimp');
  const { MessageAttachment, MessageEmbed } = require('discord.js');
  const canvas = new Jimp(500, 150);
  const avatar = await Jimp.read(member.user.displayAvatarURL({format: 'png'}));
  const path = require('path');

  const Quantify_55_white = await Jimp.loadFont(path.join(__dirname, './fonts/Quantify_55_white.fnt'));
  const Quantify_25_white = await Jimp.loadFont(path.join(__dirname, './fonts/Quantify_25_white.fnt'));
  const OpenSans_22_white = await Jimp.loadFont(path.join(__dirname, './fonts/OpenSans_22_white.fnt'));
  const mask = await Jimp.read(path.join(__dirname, './images/avatarMask.png'));

  avatar.resize(136, Jimp.AUTO);
  mask.resize(136, Jimp.AUTO);
  avatar.mask(mask, 0, 0);

  canvas.blit(avatar, 5, 5);

  canvas.print(Quantify_55_white, 158, 20, 'Bienvenue');
  canvas.print(OpenSans_22_white, 158, 70, 'sur le serveur discord');
  canvas.print(Quantify_25_white, 158, 105, member.guild.name);

  const buffer = await canvas.getBufferAsync(Jimp.MIME_PNG);
  const embedAttachment = new MessageAttachment(buffer, 'joinimg.png');

  const newMemberEmbed = new MessageEmbed()
    .attachFiles([embedAttachment])
    .setColor('#cd6e57')
    .setTitle('Ho ! Un nouveau membre !')
    .setDescription(`Faites du bruit pour __**${member.displayName}**__ !`)
    .setImage('attachment://joinimg.png');
  
  member.guild.channels.cache.find(c => c.id === db.get(`welchannel_${member.guild.id}`)).send(`🎉  Bienvenue <@${member.id}>  🎉!`, {embed: newMemberEmbed});
  if(!member.user.bot) {
    if (member.guild.id === "835780444770533437") {
    member.send(`${member}, merci de passer la vérification en envoyant \`r!verify\` dans le salon <#846314585581027328> ! Ensuite, suivez les étapes affichées !`)
  }}
  
});

function xp(message) {
    if (!client.cooldown.has(`${message.author.id}`) || !(Date.now() - client.cooldown.get(`${message.author.id}`) > client.config.cooldown)) {
        let xp = db.add(`xp_${message.author.id}`, 1);
        let level = Math.floor(0.3 * Math.sqrt(xp));
        let lvl = db.get(`level_${message.author.id}`) || db.set(`level_${message.author.id}`,1);;
        if (level > lvl) {
            let newLevel = db.set(`level_${message.author.id}`,level);
            message.channel.send(`:tada: ${message.author.toString()}, Tu es maintenant au niveau ${newLevel}!`);
        }
        client.cooldown.set(`${message.author.id}`, Date.now());
    }
}

client.login(process.env.TOKEN);

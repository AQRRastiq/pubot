const { token, default_prefix } = require("./config.json");
const { badwords } = require("./data.json") 
require('dotenv').config();
const discord = require("discord.js");
//Gonna use Discord.js Module xD
const client = new discord.Client({
  disableEveryone: true // what does this disable thing do?
});
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

const { CanvasSenpai } = require("canvas-senpai")
const canva = new CanvasSenpai();
const emojis = JSON.parse(fs.readFileSync('emojis.json', 'utf8'));
client.on('messageReactionAdd', addRole);
client.on('messageReactionRemove', removeRole);
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
  console.log("I am Reday to Go");
  client.user.setActivity("p!help", ({type: "WATCHING"})); //It will set status :)
  onReady();
});
async function onReady() {
  const channel = client.channels.cache.find((channel) => channel.name === emojis.channel);

  // channel will not contain messages after it is found
  try {
    await channel.messages.fetch();
  } catch (err) {
    console.error('Error fetching channel messages', err);
    return;
  }

  emojis.message_id = "836140253344432128"

  console.log(`Watching message '${emojis.message_id}' for reactions...`)
}
async function addRole({message, _emoji}, user) {
  if (user.bot || message.id !== emojis.message_id) {
    return;
  }

  // partials do not guarantee all data is available, but it can be fetched
  // fetch the information to ensure everything is available
  // https://github.com/discordjs/discord.js/blob/master/docs/topics/partials.md

  const { guild } = message;

  const member = guild.members.cache.get(user.id);
  const role = guild.roles.cache.find((role) => role.name === "Vérifié");

  if (!role) {
    console.error(`Role not found for '${_emoji.name}'`);
    return;
  }
  
  try {
    member.roles.add(role.id);
  } catch (err) {
    console.error('Error adding role', err);
    return;
  }
}
async function removeRole({message, _emoji}, user) {
  if (user.bot || message.id !== emojis.message_id) {
    return;
  }

  // partials do not guarantee all data is available, but it can be fetched
  // fetch the information to ensure everything is available
  // https://github.com/discordjs/discord.js/blob/master/docs/topics/partials.md
  if (message.partial) {
    try {
      await message.fetch();
    } catch (err) {
      console.error('Error fetching message', err);
      return;
    }
  }

  const { guild } = message;

  const member = guild.members.cache.get(user.id);
  const role = guild.roles.cache.find((role) => role.name === "Vérifié");

  if (!role) {
    console.error(`Role not found for '${_emoji.name}'`);
    return;
  }

  try{
    member.roles.remove(role.id);
  } catch (err) {
    console.error('Error removing role', err);
    return;
  }
}

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
  //START



  if(!message.guild === null){
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
    }    
    
    
  }}
  
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
  let chx = db.get(`welchannel_${member.guild.id}`);

  if (chx === null) {
    return;
  }

  
   let data = await canva.welcome(member, { link: "https://i.pinimg.com/originals/f3/1c/39/f31c39d56512dc8fbf30f9d0fb3ee9d3.jpg" })
 
    const attachment = new discord.MessageAttachment(
      data,
      "welcome-image.png"
    );
  
  


  client.channels.cache.get(chx).send("Bienvenue dans notre serveur, " + member.user.username + " !", attachment);
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

const db = require("quick.db")

module.exports = {
  name: "warnings",
  description: "Avoir le nombre de warns de quelqu'un",
  category: "moderation",
  run: (client, message, args) => {
    const user = message.mentions.members.first() || message.author
    
  
    let warnings = db.get(`warnings_${message.guild.id}_${user.id}`)
    
    
    if(warnings === null) warnings = 0;
    
    
    message.channel.send(`${user} a **${warnings}** warning(s)`)
  
  
  }
}
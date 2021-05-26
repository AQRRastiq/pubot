const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment } = require('discord.js');
const ee = require("../../botconfig/embed.json");
const fse = require('fs-extra');
const fs = require('fs');
var archiver = require('archiver');

module.exports = {
  name: "jointocreate",
  category: "creation",
  description: "Créer un bot \"join to create\"",
  usage: "jointocreate",
  run: async (client, message, args) => {
    try{
      let approvalmsg = await message.author.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`Est-ce que vous avez NodeJS 11.0.0 **__OU__** Plus récent ?`)
        .setURL("https://nodejs.org/en/")
        .setDescription("Si oui, veuillez réagir ✅ pour continuer ! S'il n'est pas installé, votre bot ne marchera pas !!\n*Aussi, [Python](https://www.python.org/downloads/) et [Ffmpeg](http://ffmpeg.org/download.html) peuvent être très utiles pour certains projets NodeJS !*")
      )
      approvalmsg.react("✅")
      let error = false;
      await approvalmsg.awaitReactions((reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id, { max: 1, time: 60000, errors: ['time'] })
    	.then(collected => {
        if (collected.first().emoji.name == '✅') {
                                            let token, prefix,  owner = message.author.id, author = message.author;
      message.author.send(
        new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`Veuillez envoyer un token de bot ! (Ce token sera seulement utilisé pour le tester et compiler le bot et ne sera jamais partagé)`)
          .setDescription(`Vous avez 180 secondes !\n\nAllez sur : https://discord.com/developers \n**-->** New application\n**-->** Create a Bot sous le tab \`BOT\`\n**-->** Copiez le token et envoyez-le à moi !\n\n***Vous pourrez mettre l'avatar, le nom et inviter le bot dans votre serveur plus tard !***`)
      ).then(msg => {
        msg.channel.awaitMessages(m=>m.author.id === author.id, { max: 1, time: 180000, errors: ['time'] })
        .then(async collected => {
            token = collected.first().content;
            if(token.length != "NzQ4MDg3OTA3NTE2MTUzODg5.X0YVJw.Wk6lEEwy158ZQ3wvKx3uvdnoWGA".length)
              author.send(new MessageEmbed()
                .setFooter(ee.footertext,ee.footericon)
                .setColor(ee.wrongcolor)
                .setTitle("Ce n'est pas un token valide ! Veuillez réassayer !")
              )
            let workingtoken = await checktoken(token);
            if(!workingtoken)
              author.send(new MessageEmbed()
                .setFooter(ee.footertext,ee.footericon)
                .setColor(ee.wrongcolor)
                .setTitle("Ce n'est pas un token valide ! Veuillez réassayer !")
                .setDescription(`La longueur du token est correcte mais le token ne marche pas, je l'ai testé !`)
              )
                message.author.send(
                  new MessageEmbed()
                    .setColor(ee.color)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`Vous avez 180 secondes !\n\nVeuillez entrer un PREFIXE!`)
                    .setDescription(`Vous pourrez toujours ping votre bot, mais veuillez mettre un préfixe par défault comme : \`j!\`\n\n**`)
                ).then(msg=>{
                  msg.channel.awaitMessages(m=>m.author.id === author.id, { max: 1, time: 180000, errors: ['time'] })
                  .then(collected => {
                    prefix = collected.first().content;
		    collected.first().delete
                    let jointocreateconfig = require("../../bots/jointocreate/botconfig/config.json")
                    let oldconfig = jointocreateconfig;
                    oldconfig.token = token;
                    oldconfig.prefix = prefix;
                    oldconfig.owner = owner;
                    fs.writeFile("./bots/jointocreate/botconfig/config.json", JSON.stringify(oldconfig, null, 3), async (e) => {
                      if (e) {
                        console.log(String(e.stack).red);
                        author.send(new MessageEmbed()
                          .setFooter(ee.footertext,ee.footericon)
                          .setColor(ee.wrongcolor)
                          .setTitle("❌ ERREUR en créeant le fichier de configuration !")
                          .setDescription(`\`\`\`${e.message}\`\`\``)
                        )
                      }
                      let tempmsg = await author.send(new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setAuthor(`Config créée...  |  Envoi du bot...`, "https://www.bluechipexterminating.com/wp-content/uploads/2020/02/loading-gif-png-5.gif")
                      )
                      const srcDir = `./bots/jointocreate/`;
                      const destDir = './jointocreate.zip'
                      var output = fs.createWriteStream(destDir);
                      var archive = archiver('zip');
                      output.on('close', function () {
                        setTimeout(()=>{
                          const attachment = new MessageAttachment(destDir);
                          author.send(attachment)
                          tempmsg.edit(new MessageEmbed()
                            .setColor(ee.color)
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                            .setTitle(`Comment utiliser le bot ?`)
                            .setDescription(`1. Télécharger le ZIP\n2. Extraire le ZIP dans un DOSSIER\n3. Ouvrir CMD ou PowerShell dans ce dossier !\n4. Ecrire: \`npm install\` pour installer les dépendances nécessaires ("discord.js", "ascii-table" et "colors")\n5. Après, écrire \`node index.js\` Et le bot va se lancer!\n\n\nMaintenant invite le bot dans ton serveur et écris \`${prefix}addchannel <ID de salon>\` pour ajouter un salon join to create !\nVous pouvez avoir plusieurs salons join to create en même temps !\nPour en enlever un écris: \`${prefix}removechannel <ID de salon>\`\n\nPour voir les autres commandes écris: \`${prefix}help\`\n*Noter que le bot marche seulement dans un serveur à la fois !*\n\nTu peux aussi changer les couleurs des embed dans \`/botconfig/embed.json\``)
                          )
                          setTimeout(()=>{
                            try {
                              fs.unlinkSync(destDir)
                            } catch(e) {
                            }
                            oldconfig = jointocreateconfig;
                            oldconfig.token = "";
                            oldconfig.prefix = "";
                            oldconfig.owner = "";
                            fs.writeFile("./bots/jointocreate/botconfig/config.json", JSON.stringify(oldconfig, null, 3), async (e) => {
                              if (e) {
                                console.log("couldnt reset jointocreate")
                              }
                              console.log("resetted jointocreate")
                            })
                            return;
                          }, 1000)
                        }, 1000)
                      });
                      archive.on('error', function(e){
                        console.log(String(e.stack).red);
                        author.send(new MessageEmbed()
                          .setFooter(ee.footertext,ee.footericon)
                          .setColor(ee.wrongcolor)
                          .setTitle("❌ ERREUR en crééant le ZIP")
                          .setDescription(`\`\`\`${e.message}\`\`\``)
                        )
                      });
                      archive.pipe(output);
                      // append files from a sub-directory, putting its contents at the root of archive
                      archive.directory(srcDir, false);
                      // append files from a sub-directory and naming it `new-subdir` within the archive
                      archive.directory('subdir/', 'new-subdir');
                      archive.finalize();
                    })
                  }).catch(e => {
                    console.log(String(e.stack).bgRed)
                    author.send(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ ERREUR`)
                        .setDescription(`\`\`\`${e.message}\`\`\``)
                    );
                  })
                }).catch(e => {
                  console.log(String(e.stack).bgRed)
                  message.author.send(new MessageEmbed()
                      .setColor(ee.wrongcolor)
                      .setFooter(ee.footertext, ee.footericon)
                      .setTitle(`❌ ERREUR`)
                      .setDescription(`\`\`\`${e.message}\`\`\``)
                  );
                })
              })
        .catch(e => {
              console.log(String(e.stack).bgRed)
              message.author.send(new MessageEmbed()
                  .setColor(ee.wrongcolor)
                  .setFooter(ee.footertext, ee.footericon)
                  .setTitle(`❌ ERREUR`)
                  .setDescription(`\`\`\`${e.message}\`\`\``)
              );
              error = true;
            });
            if(error) return;
      }).catch(e => {
                console.log(String(e.stack).bgRed)
                return message.author.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`❌ ERREUR`)
                    .setDescription(`\`\`\`${e.message}\`\`\`*Veuillez activer vos DMs !*`)
                );
                error = true;
              });
              if(error) return;
                                    }
      })
    	.catch(e => {
        console.log(String(e.stack).bgRed)
        message.author.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERREUR | Annulé, vous n'avez pas réagi à temps !`)
        );
        error = true;
    	});
      if(error) return;

      

    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.author.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERREUR`)
            .setDescription(`\`\`\`${e.message}\`\`\``)
        );
    }
  }
}
async function checktoken(token){
  let testclient = new Discord.Client();
  try{
    await testclient.login(token)
    testclient.on("ready", () => testclient.destroy() )
    return true;
  } catch {
    console.log("INVALID TOKEN")
    return false;
  }
}
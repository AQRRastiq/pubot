module.exports = {
  name: "ping",
  category: "info",
  description: "Avoir le ping du bot :)",
  usage: "ping",
  run: (client, message) => {
    message.channel.send(`**Pong !** ~${client.ws.ping}ms`);
  }
  
}
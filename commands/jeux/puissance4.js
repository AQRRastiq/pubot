const Discord = require("discord.js");
const fs = require('fs');

var board;
var blank = "⚪";
var red = "🔴";
var black = "⚫";

var player1;
var player2;
var nextPlayer;
var aiColor = black;

var useDMs = false;

function newPlayerGame(msg, message) {
    var p2 = message;

    
    player1 = msg.author.id;
    nextPlayer = player1;
    message.channel.send(p2 + ", vous avez été défié par <@" + player1 + "> ! Voulez-vous jouer avec lui ?").then(msgreact => {
        message.awaitReactions((reaction, user) => user.id == message.author.id,
                            { max: 1, time: 30000 }).then(collected => {
                                    if (collected.first().emoji.name == '✅') {
                                        newGame(msg, msg.author.username, p2);
                                    }else{
                                        message.channel.send(p2 + "a décliné votre défi.").then(msgdelete => {
                                            setTimeout(() => {
                                                msgdelete.delete;
                                            }, 5000)
                                        })
                                    }
                                    
                            }).catch(() => {
                                    message.channel.send('Pas de réaction après 30 secondes, partie annulée').then(msgerror => {
                                        setTimeout(() => {
                                            msgerror.delete;
                                        }, 5000)
                                    })
                            });
    })
    

}

function newGame(msg, p1, p2) {
    msg.channel.send("Nouvelle partie entre " + p1 + " et moi ! A toi l'ami !");
    resetBoard();
    displayBoard(msg);
    nextPlayer = player1;
}

function newGameAIStarts(msg, p1, p2) {
    msg.channel.send("New game started between " + p1 + " and " + p2 + "!");
    resetBoard();
    playForAI(msg);
    nextPlayer = player2;
}

function resetBoard() {
    board = []
    for(var i = 0; i < 6; i++) {
        var row = [blank, blank, blank, blank, blank, blank, blank];
        board.push(row);
    }
}

function displayBoard(msg) {
    var boardMessage = "";
    for(var i = 0; i < board.length; i++) {
        for(var j = 0; j < board[i].length; j++) {
            boardMessage += board[i][j];
        }
        boardMessage += "\n";
    }
    if(useDMs)
    {
        dmUser(nextPlayer, boardMessage);
        dmUser(getNextPlayer(), boardMessage);
    }
    else
        msg.channel.send(boardMessage);
}

function getNextPlayer() {
    if(nextPlayer === player1)
        return player2;
    else
        return player1;
}

function dmUser(userId, message) {
    var user = client.users.find('id', userId.toString());//client.users[userId];
    console.log("Sending the following dm to " + user.username + ": " + message);
    user.createDM().then(function(dm) {
        dm.send(message);
    });
}

function playMove(msg, message) {
    if(msg.author.id !== player1 && msg.author.id !== player2) {
        msg.reply("Tu ne joues pas dans cette partie!");
        return;
    }
    if(msg.author.id !== nextPlayer) {
        msg.reply("Ce n'est pas ton tour !");
        return;
    }
    var columnString = getStringAfterSpace(message);
    var column = parseInt(columnString);
    if(!(column >= 1 && column <= 7)) {
        msg.reply(columnString + " est une colonne illégale ! Prends une colonne entre 1 et 7.");
        return;
    }
    column--;
    var row = getAvailableRowInColumn(column)
    if(row == -1) {
        msg.reply((column+1) + " Est remplie, prends une colonne disponible !");
        return;
    }
    
    var color = getCurrentColor(msg.author.id);
    
    board[row][column] = color;
    
    if(detectWin(color)) {
        notifyWin(msg);
        resetBoard();
        return;
    }
    
    if(boardFull()) {
        displayBoard(msg);
        msg.channel.send("Le tableau est rempli sans gagnant. Egalité!\nEn train de reset le tableau...");
        resetBoard();
        return;
    }
    
    if(!player1 || !player2) {
        playForAI(msg);
        return;
    }
    
    displayBoard(msg);
    setNextPlayer();
}

function notifyWin(msg) {
    displayBoard(msg);
    if(useDMs) {
        dmUser(nextPlayer, "Tu as gagné ! Bien joué !\nEn train de reset le tableau...");
        dmUser(getNextPlayer(), "Tu as perdu !\nEn train de reset le tableau...");
    }
    else
        msg.reply("Tu as gagné ! Bien joué !\nEn train de reset le tableau...");
}

function getStringAfterSpace(string) {
    if(string.indexOf(" ") > 0)
        return string.slice(string.indexOf(" ")+1, string.length);
    return null;
}

function getAvailableRowInColumn(column) {
    //If top row is full
    if(board[0][column] !== blank)
        return -1;
    
    for(var i = 1; i < 6; i++) {
        if(board[i][column] !== blank)
            return i-1;
    }
    return 5;
}

function getCurrentColor(playerId) {
    if(player1 === playerId)
        return red;
    return black;
}

function detectWin(color) {
    for(var row = 0; row < board.length; row++) {
        for(var column = 0; column < board[row].length; column++) {
            if(board[row][column] === color) {
                if(detectWinAroundPiece(color, row, column)) {
                    return true;
                }
            }
        }
    }
}

function detectWinAroundPiece(color, row, column) {
    if(row >= 3) {
        //Detect a win down a column
        if(board[row][column] === color && board[row-1][column] === color && board[row-2][column] === color && board[row-3][column] === color)
            return true;
        //Detect a win down a diagonal
        if(column >= 3) {
            if(board[row][column] === color && board[row-1][column-1] === color && board[row-2][column-2] === color && board[row-3][column-3] == color)
                return true;
        }
        //Detect win down other diagonal
        if(column <= 3) {
            if(board[row][column] === color && board[row-1][column+1] === color && board[row-2][column+2] === color && board[row-3][column+3] == color)
                return true;
        }
    }
    //Detect a win along a row
    if(column >=3) {
        if(board[row][column] === color && board[row][column-1] === color && board[row][column-2] === color && board[row][column-3] === color)
            return true;
    }
}

function boardFull() {
    for(var i = 0; i < board[0].length; i++) {
        if(board[0][i] === blank)
            return false;
    }
    return true;
}

function playForAI(msg) {
    playRandomMove(aiColor);
    displayBoard(msg);
    
    if(detectWin(aiColor)) {
        msg.reply("Tu as perdu !\nEn train de reset le tableau...");
        resetBoard();
        return;
    }
    
    if(boardFull()) {
        msg.channel.send("Le tableau est rempli sans gagnant. Egalité!\nEn train de reset le tableau...");
        resetBoard();
        return;
    }
}

function playRandomMove(color) {
    var possibleMoves = getPossibleMoves();
    var winningMoves = getWinningMoves(possibleMoves, color);
    if(winningMoves.length > 0) {
        var column = winningMoves[getRandomInt(0, winningMoves.length-1)];
        var row = getAvailableRowInColumn(column);
        board[row][column] = color;
        return;
    }
    
    var blockingMoves = getWinningMoves(possibleMoves, getInverseColor(color));
    if(blockingMoves.length > 0)
        possibleMoves = blockingMoves;
    
    var column = possibleMoves[getRandomInt(0, possibleMoves.length-1)];
    var row = getAvailableRowInColumn(column);
    board[row][column] = color;
}

function getPossibleMoves() {
    var possibleMoves = [];
    for(var i = 0; i < 7; i++) {
        if(getAvailableRowInColumn(i) > -1)
            possibleMoves.push(i);
    }
    return possibleMoves;
}

function getInverseColor(color) {
    if(color === black)
        return red;
    return black;
}

function getWinningMoves(possibleMoves, color) {
    var winningMoves = [];
    for(var i = 0; i < possibleMoves.length; i++) {
        var backupBoard = hardCopy2DArray(board);
        board[getAvailableRowInColumn(possibleMoves[i])][possibleMoves[i]] = color;
        if(detectWin(color)) {
            winningMoves.push(possibleMoves[i]);
        }
        board = hardCopy2DArray(backupBoard);
    }
    return winningMoves;
}

function hardCopy2DArray(sourceArray) {
    var newArray = [];
    for(var i = 0; i < sourceArray.length; i++) {
        var row = [];
        for(var j = 0; j < sourceArray[i].length; j++) {
            row.push(sourceArray[i][j]);
        }
        newArray.push(row);
    }
    return newArray;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setNextPlayer() {
    nextPlayer = getNextPlayer();
}

module.exports = {
    name: "puissancequatre",
    description: "Lancer une partie de puissance 4 !",
    usage: "puissancequatre @mention",
    category: "jeux",
    run: async (client, message, args) => {
        if (!message.mentions.users.first()) {
            message.channel.send(new Discord.MessageEmbed()
            .setTitle("Puissance 4")
            .setAuthor("RBot")
            .setImage(client.user.displayAvatarURL())
            .setDescription("Veuillez mentionner la personne avec laquelle vous voulez jouer ou écrivez \"IA\" pour lancer une partie contre l'IA.")).then(embedmsg => {
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    {max: 1, time: 15000}).then(collected => {
                        embedmsg.delete;
                        if (collected.first().content === "IA") {
                            newGame(message, message.author.username, "l'IA");
                        }else {
                            if (!collected.first().mentions.users.first()) {
                                message.channel.send("Aucun utilisateur mentionné, partie annulée.").then(msg => {
                                    setTimeout(() => {
                                        msg.delete;
                                    }, 5000)
                                })
                            }
                            else{
                                newPlayerGame(message, collected.first().mentions.users.first());
                            }
                        }
                            
                    }).catch(() => {
                            message.reply('Aucune réponse après 15 secondes, partie annulée.');

                    });
            })
            
        }else{
            if (message.mentions.users.first().id === client.user.id) {
                aiColor = black;
                player1 = msg.author.id;
                player2 = null;
                newGame(message, message.author.username, "l'IA");
            }else{
                newPlayerGame(message, message.mentions.users.first());
            }


        }
        
    }
}
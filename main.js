const Discord = require('discord.js');
const settings = require('./settings.json');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.isMentioned(client.user)) {
    // find the verified role for the server
    var verifiedRole = null;
    for (const role of msg.guild.roles) {
      if (role[1].name == 'Verified') {
        verifiedRole = role[0];
        break;
      }
    }

    if (verifiedRole == null) {
      msg.channel.send("**ERROR:** Verified role not found");
    } else {
      // check if the user already has the verified role
      var isVerified = false;
      try {
        for (const role of msg.member.roles) {
          if (role[1].name == 'Verified') {
            isVerified = true;
            break;
          }
        }
      } catch { } // hacky af but i need this working now

      if (isVerified) { // user already has role
        msg.channel.send(
          '**VERIFICATION REQUEST RECIEVED**' +
          '\n**User:** `' + msg.author.tag + '`' +
          '\n**Verified**: `TRUE`\n' +
          'No further action required'
        );
      } else { // user does not already have role
        msg.member.addRole(verifiedRole);

        msg.channel.send(
          '**VERIFICATION REQUEST RECIEVED**' +
          '\n**User:** `' + msg.author.tag + '`' +
          '\n**Verified**: `FALSE`' +
          '\nVerifying...\n' + 
          'Done\n' +
          'Welcome `' + msg.author.username + '`'
        );
      }
    }

    msg.delete();
  }
});

client.login(settings.token);

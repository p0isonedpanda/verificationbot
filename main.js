const Discord = require('discord.js');
const settings = require('./settings.json');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author == client.user) return;

  if (msg.isMentioned(client.user))
    VerifyUser(msg);
  else if (msg.channel.name == 'verify-me')
    InvalidCommand(msg);
});

function VerifyUser(msg)
{
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

    for (const role of msg.member.roles) {
      if (role[1].name == 'Verified') {
        isVerified = true;
        break;
      }
    }

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

function InvalidCommand(msg) {
  msg.channel.send(
    '**INVALID COMMAND**\n' +
    'Please read the rules in `#welcome` `' + msg.author.username + '` to understand how to properly verify yourself'
  );

  msg.delete();
}

client.login(settings.token);

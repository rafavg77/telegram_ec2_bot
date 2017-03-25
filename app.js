var token = '<TELEGRAM_BOT_KEY>';
var Bot = require('node-telegram-bot-api');
var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

// Create EC2 service object
ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

var params = {
  InstanceIds: ['<Instance-ec2-ID>'],
  DryRun: false
};

var permit = 32268671;

bot = new Bot(token,{polling : true});

console.log('bot server started...');

bot.onText(/^\/startinstance/, function (msg, match) {
  var name = match[1];
  ec2.describeInstanceStatus(params, function(err,data) {
    if(err){
      console.log(err, err,stack);
    } else{
      console.log(data.InstanceStatuses[0]);
      if(data.InstanceStatuses[0] === undefined ){
        console.log('se procede a encender el server');
        ec2.startInstances(params, function(err, data) {
          if (err && err.code === 'DryRunOperation') {
            params.DryRun = false;
            ec2.startInstances(params, function(err, data) {
              if (err) {
                console.log("Error", err);
              } else if (data) {
                console.log("Success", data.StartingInstances);
              }
            });
          } else {
            console.log("You don't have permission to start instances.");
          }
        });
        bot.sendMessage(msg.chat.id, 'Minecraft-Bot: Starting Instance').then(function () {
        });
      }else if(data.InstanceStatuses[0].InstanceState.Name){
        bot.sendMessage(msg.chat.id, 'Minecraft-Bot: The Server already running').then(function () {

        });
      }
    }
  });
});

bot.onText(/^\/stopinstance/, function (msg, match) {
  var name = match[1];

  ec2.describeInstanceStatus(params, function(err,data) {
    if(err){
      console.log(err, err,stack);
    } else{
      console.log(data.InstanceStatuses[0]);
      if(data.InstanceStatuses[0] === undefined){
        bot.sendMessage(msg.chat.id, 'Minecraft-Bot: The Server already Stoped, Nothing to do').then(function () {

        });
      } else{
        ec2.stopInstances(params, function(err, data) {
          if (err && err.code === 'DryRunOperation') {
            params.DryRun = false;
            ec2.stopInstances(params, function(err, data) {
              if (err) {
                console.log("Error", err);
              } else if (data) {
                console.log("Success", data.StoppingInstances);
              }
            });
          } else {
            console.log("You don't have permission to stop instances");
          }
        });
        bot.sendMessage(msg.chat.id, 'Minecraft-Bot: Stoping Instance').then(function () {

        });
      }
    }
  });
});

bot.onText(/^\/status/, function (msg, match) {
  var name = match[1];
  bot.sendMessage(msg.chat.id, 'The Status is').then(function () {
  });
});

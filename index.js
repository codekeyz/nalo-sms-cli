#!/usr/bin/env node
'use strict';

const program = require('commander');
const inquirer = require('inquirer');
const Configstore = require('configstore');
const chalk = require('chalk');
const questions = require('./lib/question');
const constants = require('./lib/constants');
const api = require('./lib/api');
const path = require('path');
const packageJson = require(path.join(__dirname, 'package.json'));

// Create a Configstore instance
const configStore = new Configstore(packageJson.name);

program
  .name('nalo-sms')
  .version(packageJson.version, '-v, --version')
  .description(packageJson.description)
  .usage('[command] [options]');

program
  .command('set <value>')
  .option('-u, --user', 'Set a global nalo-sms username')
  .option('-p, --pass', 'Set a global nalo-sms password')
  .option('-s, --source', 'Set a global nalo-sms message source')
  .description('Set global config for nalo-sms-cli')
  .action(function(value, cmd) {
    if (cmd.user) {
      configStore.set('user.username', value);
    }
    if (cmd.pass) {
      configStore.set('user.password', value);
    }
  });

program
  .command('send')
  .description('Send message from the cli')
  .action(function() {
    const query = questions.send_message_question(configStore);

    inquirer.prompt(query).then(res => {
      res.dlr = res.dlr ? 1 : 0;
      res.type = constants.getMessageType(res.type);

      res.username =
        res.use_global_user === true
          ? configStore.get('user.username')
          : res.username;

      res.password =
        res.use_global_pass === true
          ? configStore.get('user.password')
          : res.password;

      if (res.store_username) {
        configStore.set('user.username', res.username);
      }

      if (res.store_password) {
        configStore.set('user.password', res.password);
      }

      const result = {};
      result['dlr'] = res.dlr;
      result['type'] = res.type;
      result['username'] = res.username;
      result['message'] = res.message;
      result['destination'] = res.destination;
      result['source'] = res.source;
      result['password'] = res.password;

      api
        .sendSMS(result)
        .then(res => {
          if (res.body.includes(':')) {
            console.log(
              chalk.red(constants.getErrorType(res.body.split(':')[0]))
            );
            console.log(res.body);
            return;
          }

          const code = res.body.split('|')[0];
          if (code === '1701') {
            console.log(chalk.green('Message has been successfully sent'));
          } else {
            console.log(chalk.red('Unknown error. Contact Support'));
          }
        })
        .catch(err => {
          console.log(chalk.red(err.message));
        });
    });
  });

program
  .command('balance')
  .description('Check your credit balance')
  .action(function() {
    let username =  configStore.get('user.username');
    let password = configStore.get('user.password');

    if (username == null || password == null) {
      return console.log(chalk.yellow('Run nalo-sms set [options] <value>'))
    }

    api.checkBalance(username, password)
    .then(res => {
        let result = JSON.parse(res.body);
        console.log(chalk.yellow(`Your balance is Ghc${result.balance}`));
    })
    .catch(err => {
        console.log(err.message);
    })
  });

program.parse(process.argv);

// Show help if no command is parsed
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

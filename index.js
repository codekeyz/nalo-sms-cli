#!/usr/bin/env node
'use strict';

const program = require('commander');
const inquirer = require('inquirer');
const Configstore = require('configstore');
const chalk = require('chalk');
const questions = require('./lib/question');
const types = require('./lib/type');
const api = require('./lib/api');
const path = require('path');
const packageJson = require(path.join(__dirname, 'package.json'));

// Create a Configstore instance
const configStore = new Configstore(packageJson.name);

program
  .name('nalo-sms')
  .version(packageJson.version, '-v, --version')
  .description(packageJson.description);

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
    if (cmd.source) {
      configStore.set('user.source', value);
    }
  });

program
  .command('send')
  .description('Send message from the cli')
  .action(function() {
    inquirer.prompt(questions.send_message_question(configStore)).then(res => {
      res.dlr = res.dlr ? 1 : 0;
      res.type = types.getMessageType(res.type);
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
            console.log(chalk.red(types.getErrorType(res.body.split(':')[0])));
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
          console.log(err);
        });
    });
  });

program.parse(process.argv);

// Show help if no command is parsed
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

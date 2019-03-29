exports.send_message_question = function(configStore) {
  return [
    {
      type: 'list',
      name: 'type',
      message: 'Choose Message Type',
      choices: [
        'Flash Message (GSM 3.38 Character encoding)',
        'Flash Message (ISO-88559-1 Character Encoding)',
        'Plain Text (GSM 3.38 Character Encoding)',
        'Plain Text (ISO-88559-1 Character Encoding)',
        'Reserved',
        'Unicode',
        'Unicode Flash',
        'WAP Push'
      ]
    },
    {
      type: 'input',
      name: 'message',
      message: 'Type your message now 💬 '
    },

    // Ask User to Type Source
    {
      type: 'input',
      name: 'source',
      message: 'Type message source',
      validate: function(value) {
        if (isNaN(value)) {
          return value.toString().trim().length > 12
            ? 'Source name should be less than 12 Chars'
            : true;
        } else {
          return value.match(
            /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
          )
            ? true
            : 'Please enter valid source';
        }
      }
    },

    // Ask User to type Destination Number
    {
      type: 'input',
      name: 'destination',
      message: 'Type Destination number 📱 ',
      validate: function(value) {
        var pass = value.match(
          /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
        );
        if (pass) {
          return true;
        }

        return 'Please enter a valid phone number';
      }
    },

    // Ask User if message delivery report is required
    {
      type: 'confirm',
      name: 'dlr',
      message: 'Is Delivery report required',
      default: false
    },

    // Ask User whether to use global username
    {
      type: 'confirm',
      name: 'use_global_user',
      message: 'Use Global Username',
      when: function() {
        return configStore.get('user.username') !== undefined;
      },
      default: true
    },

    // Ask User to enter username when not use global username or is undefined
    {
      type: 'input',
      name: 'username',
      message: 'Enter your Username',
      when: function(answers) {
        return (
          configStore.get('user.username') === undefined ||
          answers.use_global_user === false
        );
      }
    },

    // Ask User whether to store the newly entered username
    {
      type: 'confirm',
      name: 'store_username',
      message: 'Would you like to store this username',
      when: function(answers) {
        return answers.username !== undefined;
      }
    },

    // Ask User whether to use global password
    {
      type: 'confirm',
      name: 'use_global_pass',
      message: 'Use Global Password',
      when: function() {
        return configStore.get('user.password') !== undefined;
      },
      default: true
    },

    // Ask User to enter password when not use global password or is undefined
    {
      type: 'input',
      name: 'password',
      message: 'Enter your Password',
      when: function(answers) {
        return (
          configStore.get('user.password') === undefined ||
          answers.use_global_pass === false
        );
      }
    },

    // Ask User whether to store the newly entered password
    {
      type: 'confirm',
      name: 'store_password',
      message: 'Would you like to store this password',
      when: function(answers) {
        return answers.password !== undefined;
      }
    }
  ];
};

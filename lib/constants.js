exports.getMessageType = type => {
  switch (type) {
    case 'Flash Message (GSM 3.38 Character encoding)':
      return 1;
    case 'Flash Message (ISO-88559-1 Character Encoding)':
      return 7;
    case 'Plain Text (GSM 3.38 Character Encoding)':
      return 0;
    case 'Plain Text (ISO-88559-1 Character Encoding)':
      return 5;
    case 'Reserved':
      return 3;
    case 'Unicode':
      return 2;
    case 'Unicode Flash':
      return 6;
    case 'WAP Push':
      return 4;
    default:
      return 0;
  }
};

exports.getErrorType = type => {
  switch (type) {
    case '1025':
      return 'Insufficient Credit User';
    case '1026':
      return 'Insufficient Credit Reseller';
    case '1702':
      return 'Invalid URL';
    case '1703':
      return 'Invalid value in username or password field';
    case '1704':
      return 'Invalid value in "type" field';
    case '1705':
      return 'Invalid Message';
    case '1706':
      return 'Invalid Destination';
    case '1707':
      return 'Invalid Source (Sender)';
    case '1708':
      return 'Invalid value for "dlr" field';
    case '1709':
      return 'User validation failed';
    case '1710':
      return 'Internal Error';
    default:
      return 'Unknown error';
  }
};
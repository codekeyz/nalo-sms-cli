const got = require('got');
const consts = require('./constants').constants;
const queryString = require('query-string');

const url = consts.baseurl.concat('/bulksms/?');

exports.sendSMS = function(payload) {
  searchParams = queryString.stringify(payload);
  return got.post(url.concat(searchParams));
};

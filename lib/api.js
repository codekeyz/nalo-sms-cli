const got = require('got');
const queryString = require('query-string');
const baseurl = require('./constants').baseurl;

exports.sendSMS = function(payload) {
  let searchParams = queryString.stringify(payload);
  return got.post(`${baseurl}/bulksms/?${searchParams}`);
};

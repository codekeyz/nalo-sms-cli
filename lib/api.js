const got = require('got');

exports.sendSMS = function(payload) {
  let url = 
  `https://api.nalosolutions.com/bulksms/?username=${payload.username}&password=${payload.password}&type=${payload.type}&dlr=${payload.dlr}&destination=${payload.destination}&source=${payload.source}&message=${payload.message}`;
  console.log(url);
  
  return got.post(url);
};

exports.checkBalance = function(username, password) {
  let url = `http://sms.nalosolutions.com/nalosms/credit_bal.php?username=${username}&password=${password}`;
  return got.post(url);
}

const crypto = require('crypto')
function createCode (length = 6) {
  const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
  const code = parseInt(randomBytes.toString('hex'), 16).toString().slice(0, length);
  return code;
   }
module.exports = createCode;
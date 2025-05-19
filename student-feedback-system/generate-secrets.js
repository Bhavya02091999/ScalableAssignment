const crypto = require('crypto');

const generateSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

const secrets = {
  JWT_SECRET: generateSecret(),
  ADMIN_JWT_SECRET: generateSecret(),
  NEXTAUTH_SECRET: generateSecret(),
};

console.log(JSON.stringify(secrets, null, 2));

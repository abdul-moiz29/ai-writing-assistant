import crypto from 'crypto';

const generateJWTSecret = () => {
  // Generate a random 64-byte string
  const secret = crypto.randomBytes(64).toString('hex');
  console.log('Generated JWT Secret:');
  console.log(secret);
  return secret;
};

// Generate and display the secret
generateJWTSecret(); 
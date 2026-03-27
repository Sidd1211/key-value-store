import crypto from 'crypto';

export const hash = (key) => {
  return parseInt(
    crypto.createHash('sha1').update(key).digest('hex').substring(0, 8),
    16
  );
};
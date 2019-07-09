import secrets from '../secrets';

export default {
  development: {
    accessKeyId: secrets.S3_ACCESS_KEY,
    secretAccessKey: secrets.S3_SECRET_KEY,
    region: 'eu-central-1',
  },
  production: {
    accessKeyId: secrets.S3_ACCESS_KEY,
    secretAccessKey: secrets.S3_SECRET_KEY,
    region: 'eu-central-1',
  },
};

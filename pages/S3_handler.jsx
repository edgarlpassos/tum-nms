const secrets = require('../secrets.json');
const AWS = require('aws-sdk');

const credentials = {
  accessKeyId:     secrets.ACCESS_KEY_ID,
  secretAccessKey: secrets.SECRET_KEY_ID,
  region: 'eu-central-1',
};
const s3 = new AWS.S3(credentials);


export function getURL(bucket, key) {
  return s3.getSignedUrl('getObject', {
    Bucket: bucket,
    Key: key,
  });
}

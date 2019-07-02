const secrets = require('../secrets.json');

const credentials = {
  accessKeyId:     secrets.ACCESS_KEY_ID,
  secretAccessKey: secrets.SECRET_KEY_ID,
  region: 'eu-central-1',
};

var AWS = require('aws-sdk');
var s3 = new AWS.S3(credentials);


export function getURL(bucket, key) {
  return s3.getSignedUrl('getObject', {
    Bucket: bucket,
    Key: key,
  });
}

const secrets = require('../secrets.json');

const params = {
  accessKeyId:     secrets.ACCESS_KEY_ID,
  secretAccessKey: secrets.SECRET_KEY_ID,
  region:'eu-central-1',
};

var AWS = require('aws-sdk');
var s3 = new AWS.S3(params);

export default function getURL(bucket, key) {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  return s3.getSignedUrl('getObject', params);
}

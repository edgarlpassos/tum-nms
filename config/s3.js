import config from '../s3/config';

const s3Config = process.env.NODE_ENV === 'production' ? config.production : config.development;

const AWS = require('aws-sdk');
const s3Connection = new AWS.S3(s3Config);

export default s3Connection;

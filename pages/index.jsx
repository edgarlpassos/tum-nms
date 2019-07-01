import React from 'react';

import Video from './Video';
import Image from './Image';


const secrets = require('../secrets.json');
const params = {
  accessKeyId: secrets.ACCESS_KEY_ID,
  secretAccessKey: secrets.SECRET_KEY_ID,
  region:'eu-central-1',
};

var AWS = require('aws-sdk');
var s3 = new AWS.S3(params);

export default () => (
  <div>
    <div>Hello, World!</div>

    <Image s3={ s3 } bucket="samplevideosforstreaming" file="images/smile.jpeg" />

    <Video src="/static/media/vid/sample_video.mp4" type="video/mp4"/>

  </div>
);

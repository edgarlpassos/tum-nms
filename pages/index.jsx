import React from 'react';

import Video from './Video';
import Image from './Image';
import { getURL } from './S3_handler';


export default () => (
  <div>
    <div>Hello, World!</div>

    <Image url={ getURL("samplevideosforstreaming","images/smile.jpeg") } />
    <Video url={ getURL("samplevideosforstreaming", "sample_video.mp4") } />
  </div>
);

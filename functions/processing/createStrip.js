import fs, {
  readFileSync,
  writeFileSync,
} from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import im from 'imagemagick';
import { S3 } from 'aws-sdk';

const s3 = new S3();

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function uploadToS3(imageFileName) {
  try {
    const file = readFileSync(`/tmp/${imageFileName}`);

    await s3.putObject({
      Body: file,
      Bucket: process.env.STRIP_BUCKET_NAME,
      Key: imageFileName,
    }).promise();

    console.log('Strip uploaded.');
  } catch (error) {
    console.log(`Error uploading strip\n${error}`);
  }
}

async function createStripAndUpload(filenames, videoName) {
  const paths = filenames.map(filename => `/tmp/${filename}`);
  const imageName = `${videoName}.png`;

  im.convert.path = '/opt/bin/convert';
  im.convert(['+append', ...paths, `/tmp/${imageName}`], (err) => {
    if (err) {
      throw err;
    }
    uploadToS3(imageName);
  });
}

export function main(event) {
  // Sanity checks
  if (!event.Records) {
    console.log('Not an invocation. Aborting...');
    return;
  }

  asyncForEach(event.Records, async (record) => {
    if (!record.s3) {
      console.log('Not an S3 event. Aborting...')
      return;
    }

    const { key } = record.s3.object;
    const s3Object = await s3.getObject({
      Bucket: record.s3.bucket.name,
      Key: key,
    }).promise();

    const videoName = key.split('/')[1].split('.')[0];
    const filename = `/tmp/${videoName}.mp4`;
    writeFileSync(filename, s3Object.Body);

    let screenshots;
    ffmpeg(filename)
      .on('filenames', (filenames) => { screenshots = filenames; })
      .on('end', () => { createStripAndUpload(screenshots, videoName); })
      .on('error', (error) => { console.log(error); })
      .screenshots({
        count: 20,
        filename: `%s_${videoName}`,
        folder: '/tmp/',
        size: '127x72',
      });
  });
}

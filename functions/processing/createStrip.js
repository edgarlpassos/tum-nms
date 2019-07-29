import { copyFile, readFileSync, writeFileSync } from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import im from 'imagemagick';
import { S3 } from 'aws-sdk';
import { asyncForEach } from './utils';

const s3 = new S3();

async function uploadToS3(imageFileName, folderName, bucketName) {
  try {
    const file = readFileSync(`/tmp/${imageFileName}`);

    await s3.putObject({
      Body: file,
      Bucket: bucketName,
      Key: `public/${folderName}/${imageFileName}`,
    }).promise();

    console.log('Strip uploaded.');
  } catch (error) {
    console.log(`Error uploading strip\n${error}`);
  }
}

async function createStripAndUpload(filenames, videoName, bucketName) {
  const paths = filenames.map(filename => `/tmp/${filename}`);
  const imageName = `${videoName}.png`;

  im.convert.path = '/opt/bin/convert';
  im.convert(['+append', ...paths, `/tmp/${imageName}`], (err) => {
    if (err) {
      throw err;
    }
    uploadToS3(imageName, 'strips', bucketName);
  });
}

function getVideoName(key) {
  return key.split('/')[2].split('.')[0].split('_')[1];
}

export function main(event) {
  // Sanity checks
  if (!event.Records) {
    console.log('Not an invocation. Aborting...');
    return;
  }

  asyncForEach(event.Records, async (record) => {
    if (!record.s3) {
      console.log('Not an S3 event. Aborting...');
      return;
    }

    const { key } = record.s3.object;
    const bucketName = record.s3.bucket.name;

    const s3Object = await s3.getObject({
      Bucket: bucketName,
      Key: key,
    }).promise();

    const videoName = getVideoName(key);
    const filename = `/tmp/${videoName}.mp4`;
    writeFileSync(filename, s3Object.Body);

    let screenshots;
    ffmpeg(filename)
      .on('filenames', (filenames) => { screenshots = filenames; })
      .on('end', () => {
        createStripAndUpload(screenshots, videoName, bucketName);
        const thumbname = `${videoName}_thumbnail.png`;
        copyFile(`/tmp/${screenshots[10]}`, `/tmp/${thumbname}`, console.log);
        uploadToS3(thumbname, 'thumbnails', bucketName);
      })
      .on('error', (error) => { console.log(error); })
      .screenshots({
        count: 20,
        filename: `%s_${videoName}`,
        folder: '/tmp/',
        size: '127x72',
      });
  });
}

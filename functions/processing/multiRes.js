import { readFileSync, writeFileSync } from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { S3 } from 'aws-sdk';
import { asyncForEach } from './utils';

const s3 = new S3();

const resolutions = [
  { height: 1080, width: 1920 },
  { height: 720, width: 1280 },
  { height: 540, width: 960 },
  { height: 360, width: 640 },
  { height: 144, width: 256 },
];

async function uploadToS3(filename, bucketName) {
  try {
    const file = readFileSync(`/tmp/${filename}`);
    console.log(`${filename} - starting upload.`);

    await s3.putObject({
      Body: file,
      Bucket: bucketName,
      Key: `public/outputs/${filename}`,
    }).promise();

    console.log(`${filename} - uploaded.`);
  } catch (error) {
    console.log(`Error uploading ${filename}\n${error}`);
  }
}

async function resizeAndUpload(videoName, { height, width }, bucketName) {
  const filename = `/tmp/${videoName}.mp4`;
  const resFilename = `${height}_${videoName}.mp4`;
  const res = `${width}x${height}`;

  ffmpeg(filename)
    .videoCodec('libx264')
    .size(res)
    .save(`/tmp/${resFilename}`)
    .on('start', () => console.log(`Resizing to ${res}`))
    .on('end', () => {
      console.log(`Created resized ${resFilename}`);
      uploadToS3(resFilename, bucketName);
    });
}

function processVideo(videoName, bucketName) {
  const filename = `/tmp/${videoName}.mp4`;
  ffmpeg.ffprobe(filename, async (err, { streams: [videoMetadata, ...rest] }) => {
    const videoHeight = videoMetadata.height;

    console.log(`Got video height: ${videoHeight}`);

    const promises = resolutions.map(async (res) => {
      if (videoHeight >= res.height) {
        resizeAndUpload(videoName, res, bucketName);
      }
    })

    await Promise.all(promises);
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
    const bucketName = record.s3.bucket.name;

    const s3Object = await s3.getObject({
      Bucket: bucketName,
      Key: key,
    }).promise();

    const videoName = key.split('/')[2].split('.')[0];
    const filename = `/tmp/${videoName}.mp4`;
    writeFileSync(filename, s3Object.Body);

    processVideo(videoName, bucketName);
  });
}

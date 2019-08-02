import {
  createWriteStream,
  createReadStream,
  writeFileSync,
  readFileSync,
} from 'fs';
import { S3 } from 'aws-sdk';
import { stringify } from 'subtitle';
import archiver from 'archiver';
import Zip from 'adm-zip';

const s3 = new S3();
const zip = new Zip();
const bucketName = process.env.S3_INPUT_BUCKET_NAME;
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

function createSubtitles(comments) {
  return comments.map(({ content, username, timestamp }) => ({
    text: `${content}\n- ${username}`,
    start: timestamp * 1000,
    end: (timestamp + 2) * 1000,
  }));
}

function writeSubtitles(comments, videoName) {
  const subtitles = createSubtitles(comments);
  const srt = stringify(subtitles);
  const subtitleFilename = `/tmp/${videoName}.srt`;
  writeFileSync(subtitleFilename, srt);

  return subtitleFilename;
}

async function downloadVideo(videoKey, videoName) {
  console.log(`Downloading video file - ${videoKey}`);
  const s3Object = await s3.getObject({
    Bucket: bucketName,
    Key: videoKey,
  }).promise();
  const videoFilename = `/tmp/${videoName}.mp4`;
  writeFileSync(videoFilename, s3Object.Body);
  console.log('Video file downloaded');

  return videoFilename;
}

function createArchive(videoName, videoFilename, subtitleFilename) {
  console.log(`Archiving ${videoFilename} and ${subtitleFilename}.`);
  zip.addLocalFile(videoFilename);
  zip.addLocalFile(subtitleFilename);
  console.log('Archive created');

  return zip.toBuffer();
}

export async function main(event, context, callback) {
  const { videoKey, comments } = JSON.parse(event.body);
  const videoName = videoKey.split('/')[2].split('.')[0];

  const subtitleFilename = writeSubtitles(comments, videoName);
  const videoFilename = await downloadVideo(videoKey, videoName);
  const Body = createArchive(videoName, videoFilename, subtitleFilename);

  try {
    const params = { Bucket: bucketName, Key: `public/exports/${videoName}.zip` };

    console.log('Uploading archive to S3');
    await s3.putObject({ Body, ...params }).promise();
    console.log('Archive uploaded to S3');

    const archiveUrl = s3.getSignedUrl('getObject', params);

    callback(null, { statusCode: 200, headers, body: JSON.stringify({ archiveUrl }) });
  } catch (err) {
    callback(null, { statusCode: 500, message: err });
  }
}

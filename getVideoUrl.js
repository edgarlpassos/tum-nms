import s3 from './config/s3';

export async function main(event, context, callback) {
  const headers = {};

    let response;
    let status;

    const { Bucket, Key } = JSON.parse(event.body);
    const params = { Bucket, Key };

    try {
      const url = s3.getSignedUrl('getObject', params);

      status = 200;

      response = {
        status,
        headers,
        body: JSON.stringify(url),
      };
    } catch (error) {
      status = 500;

      response = {
        status,
        headers,
        message: error.message,
      };
    }

    callback(null, response);
}

import Video from './db/models/video';
import db from './config/db';

export async function main(event, context, callback) {
  const headers = {};

  Video.init(db);

  let response;
  let status;

  const { id } = JSON.parse(event.body);
  const filter = { id };

  try {
    const result = await Video.findAll({ where: filter });
    status = 200;

    if (result.length == 0) {
      status = 204
    }

    response = {
      status,
      headers,
      body: JSON.stringify(result),
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

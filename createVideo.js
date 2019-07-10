import Sequelize from 'sequelize';
import Video from './db/models/video';
import db from './config/db';

export async function main(event, context, callback) {
  // Do not wait for sequelize connection to close
  context.callbackWaitsForEmptyEventLoop = false;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  Video.init(db);

  let response;
  let statusCode;

  const { name, owner, location } = JSON.parse(event.body);
  const videoData = { name, owner, location };

  try {
    const createdVideo = await Video.create(videoData);
    statusCode = 201;

    response = {
      statusCode,
      headers,
      body: JSON.stringify(createdVideo),
    };
  } catch (error) {
    statusCode = 500;
    let { message } = error;

    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      statusCode = 400;
      message = 'Video owner does not exist';
    }

    response = {
      statusCode,
      headers,
      body: JSON.stringify({ message }),
    };
  }

  callback(null, response);
}

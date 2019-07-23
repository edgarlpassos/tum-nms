import Sequelize from 'sequelize';
import Like from './db/models/like';
import db from './config/db';

export async function main(event, context, callback) {
  // Do not wait for sequelize connection to close
  context.callbackWaitsForEmptyEventLoop = false;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  Like.init(db);

  let response;
  let statusCode;

  const { comment, user } = JSON.parse(event.body);

  try {
    const createdLike = await Like.findOrCreate({
      where: {
        comment: comment,
        user: user,
      },
    });

    const successful = JSON.parse(JSON.stringify(createdLike))[1]
    let body;

    if (successful) {
      statusCode = 201;
      body = JSON.stringify(createdLike);
    } else {
      statusCode = 409;
      body = 'Row already exists in DB';
    }

    response = {
      statusCode,
      headers,
      body: body,
    };
  } catch (error) {
    statusCode = 500;
    let { message } = error;

    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      statusCode = 400;
      message = 'Comment || User does not exist';
    }

    response = {
      statusCode,
      headers,
      body: JSON.stringify({ message }),
    };
  }

  callback(null, response);
}

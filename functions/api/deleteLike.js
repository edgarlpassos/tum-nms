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

  const { comment, user } = event.pathParameters;

  try {
    const removedLike = await Like.destroy({
      where: {
        comment: comment,
        user: user,
      },
    });

    const successful = JSON.stringify(removedLike);
    let body;

    if (successful == 1) {
      statusCode = 204;
      body = 'Row was deleted';
    } else {
      statusCode = 409;
      body = 'Row does not exist';
    }

    response = {
      statusCode,
      headers,
      body: body,
    };
  } catch (error) {
    statusCode = 500;

    response = {
      statusCode,
      headers,
      body: JSON.stringify(error),
    };
  }

  callback(null, response);
}

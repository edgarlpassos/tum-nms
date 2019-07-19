import Sequelize from 'sequelize';
import Comment from './db/models/comment';
import db from './config/db';

export async function main(event, context, callback) {
  // Do not wait for sequelize connection to close
  context.callbackWaitsForEmptyEventLoop = false;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  Comment.init(db);

  let response;
  let statusCode;

  const { content, video, timestamp, created_by } = JSON.parse(event.body);
  const commentData = { content, video, timestamp, created_by }

  try {
    const createdComment = await Comment.create(commentData);
    statusCode = 201;

    response = {
      statusCode,
      headers,
      body: JSON.stringify(createdComment),
    };
  } catch (error) {
    statusCode = 500;
    let { message } = error;

    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      statusCode = 400;
      message = 'Video || Owner does not exist';
    }

    response = {
      statusCode,
      headers,
      body: JSON.stringify({ message }),
    };
  }

  callback(null, response);
}

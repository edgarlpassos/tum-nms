import Sequelize from 'sequelize';
import User from './db/models/user';
import db from './config/db';

export async function main(event, context, callback) {
  // Do not wait for sequelize connection to close
  context.callbackWaitsForEmptyEventLoop = false;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  User.init(db);

  let response;
  let statusCode;

  const { username } = JSON.parse(event.body);
  const newUser = { username };

  try {
    const createdUser = await User.create(newUser);
    statusCode = 201;

    response = {
      statusCode,
      headers,
      body: JSON.stringify(createdUser),
    };
  } catch (error) {
    statusCode = 500;

    if (error instanceof Sequelize.UniqueConstraintError) {
      statusCode = 409;
    }

    response = {
      statusCode,
      headers,
      body: JSON.stringify({ message: error.message }),
    };
  }

  callback(null, response);
}

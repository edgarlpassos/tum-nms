import Sequelize from 'sequelize';
import User from './db/models/user';
import db from './config/db';

export async function main(event, context, callback) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  User.init(db);

  let response;
  let status;

  const { username } = JSON.parse(event.body);
  const newUser = { username };

  try {
    const createdUser = await User.create(newUser);
    status = 201;

    response = {
      status,
      headers,
      body: JSON.stringify(createdUser),
    };
  } catch (error) {
    status = 500;


    if (error instanceof Sequelize.UniqueConstraintError) {
      status = 409;
    }

    response = {
      status,
      headers,
      message: error.message,
    };
  }

  callback(null, response);
}

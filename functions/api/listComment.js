import Sequelize from 'sequelize';
import Comment from './db/models/comment';
import User from './db/models/user';
import db from './config/db';

export async function main(event, context, callback) {
  // Do not wait for sequelize connection to close
  context.callbackWaitsForEmptyEventLoop = false;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  Comment.init(db);
  User.init(db);

  Comment.belongsTo(User, {foreignKey: 'created_by'});
  User.hasMany(Comment, {foreignKey: 'id'});

  let response;
  let statusCode;

  const id = event.pathParameters.id;

  try {
    const result = await Comment.findAll({
      order: [
        ['createdAt', 'DESC'],
      ],
      where: { video: id },
      include: [{
        model: User,
        required: false,
        attributes: ['username'],
       }]
    });

    statusCode = 200;

    response = {
      statusCode,
      headers,
      body: JSON.stringify(result),
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

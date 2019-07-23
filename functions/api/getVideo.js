import Video from './db/models/video';
import User from './db/models/user';
import db from './config/db';

export async function main(event, context, callback) {
  // Do not wait for sequelize connection to close
  context.callbackWaitsForEmptyEventLoop = false;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  Video.init(db);
  User.init(db);

  Video.belongsTo(User, {foreignKey: 'owner'});
  User.hasMany(Video, {foreignKey: 'id'});

  let response;
  let statusCode;

  const id = event.pathParameters.id;

  try {
    const result = await Video.findByPk(id, {
      include: [{
        model: User,
        required: false,
        attributes: ['username'],
       }]
    });

    statusCode = 200;
    let body = JSON.stringify(result);

    if (result === null) {
      statusCode = 404;
      body = JSON.stringify({ message: 'Empty query result' });
    }

    response = {
      statusCode,
      headers,
      body,
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

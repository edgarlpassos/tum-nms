import db from './config/db';

export async function main(event, context, callback) {
  // Do not wait for sequelize connection to close
  context.callbackWaitsForEmptyEventLoop = false;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  let response;
  let statusCode;

  const { videoId, userId } = event.pathParameters;

  try {
    const result = await db.query(
      `SELECT id, content, video, timestamp, created_by, username, coalesce(n_likes, 0) AS n_likes, coalesce(liked, 0) liked, "createdAt", "updatedAt" FROM \
        (SELECT id, content, video, timestamp, created_by, "createdAt", "updatedAt" FROM public."Comments" WHERE video = ${videoId}) a \
        LEFT JOIN ( SELECT comment, user, count(*) AS n_likes FROM public."Likes" GROUP BY comment ) c ON a.id = c.comment \
        JOIN (SELECT id AS user_id, username, picture FROM public."Users") d ON a.created_by = d.user_id \
        LEFT JOIN (SELECT COUNT(*) AS liked, comment from public."Likes" where "user" = ${userId} group by comment) e on a.id = e.comment \
      ORDER BY "createdAt" DESC;`,
      {type: db.QueryTypes.SELECT}
    );
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

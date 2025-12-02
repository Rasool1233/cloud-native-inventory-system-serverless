// Lambda API handler (Node.js 18)
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const REGION = process.env.AWS_REGION || 'us-east-1';
const TABLE = process.env.TABLE_NAME;

const client = new DynamoDBClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log('event', JSON.stringify(event));
  const method = event.requestContext.http.method;
  const path = event.rawPath || event.path;
  const body = event.body ? JSON.parse(event.body) : null;
  // For SPA demo, shopId can be passed as a query param header or from authenticated claims
  const shopId = (event.headers && (event.headers['x-shop-id'] || event.headers['X-Shop-Id'])) || 'SHOP1';

  try {
    if (method === 'GET' && event.pathParameters && event.pathParameters.id) {
      const productId = event.pathParameters.id;
      const pk = `SHOP#${shopId}`;
      const sk = `PRODUCT#${productId}`;
      const res = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: pk, SK: sk } }));
      return response(200, res.Item || {});
    }

    if (method === 'GET') {
      const pk = `SHOP#${shopId}`;
      const res = await ddb.send(new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :pfx)',
        ExpressionAttributeValues: { ':pk': pk, ':pfx': 'PRODUCT#' }
      }));
      return response(200, res.Items || []);
    }

    if (method === 'POST') {
      const productId = body.productId || `P-${Date.now()}`;
      const pk = `SHOP#${shopId}`;
      const sk = `PRODUCT#${productId}`;
      const item = {
        PK: pk,
        SK: sk,
        productId,
        sku: body.sku,
        name: body.name,
        price: body.price || 0,
        stock: body.stock || 0,
        threshold: body.threshold || 0,
        imageUrl: body.imageUrl || null,
        lastSoldDate: body.lastSoldDate || null,
        createdAt: new Date().toISOString()
      };
      await ddb.send(new PutCommand({ TableName: TABLE, Item: item }));
      return response(201, item);
    }

    if (method === 'PATCH' && event.pathParameters && event.pathParameters.id) {
      const productId = event.pathParameters.id;
      const pk = `SHOP#${shopId}`;
      const sk = `PRODUCT#${productId}`;
      const updates = Object.keys(body).map((k, i) => `#k${i} = :v${i}`).join(', ');
      const exprNames = {}; const exprValues = {};
      Object.keys(body).forEach((k,i) => { exprNames[`#k${i}`] = k; exprValues[`:v${i}`] = body[k];});
      const res = await ddb.send(new UpdateCommand({
        TableName: TABLE,
        Key: { PK: pk, SK: sk },
        UpdateExpression: `SET ${updates}`,
        ExpressionAttributeNames: exprNames,
        ExpressionAttributeValues: exprValues,
        ReturnValues: 'ALL_NEW'
      }));
      return response(200, res.Attributes || {});
    }

    return response(400, { message: 'Unsupported operation' });
  } catch (err) {
    console.error(err);
    return response(500, { error: err.message, stack: err.stack });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
}

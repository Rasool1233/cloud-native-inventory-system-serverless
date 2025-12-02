// DynamoDB stream processor: publish low-stock alerts to SNS
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const sns = new SNSClient({ region: process.env.AWS_REGION || 'us-east-1' });
const TOPIC_ARN = process.env.SNS_TOPIC_ARN || process.env.SNS_ARN;

exports.handler = async (event) => {
  console.log('Stream event', JSON.stringify(event, null, 2));
  for (const record of event.Records) {
    if (record.eventName !== 'MODIFY') continue;
    const newImg = unmarshall(record.dynamodb.NewImage);
    const oldImg = unmarshall(record.dynamodb.OldImage);
    const stockNew = Number(newImg.stock || 0);
    const stockOld = Number(oldImg.stock || 0);
    const threshold = Number(newImg.threshold || 0);
    const productName = newImg.name || newImg.productId || '(unknown)';

    if (stockNew <= threshold && stockNew < stockOld) {
      const msg = `Low stock alert for ${productName}: current stock ${stockNew} (threshold ${threshold}).`;
      try {
        await sns.send(new PublishCommand({ TopicArn: TOPIC_ARN, Message: msg, Subject: 'Low stock alert' }));
        console.log('Published SNS:', msg);
      } catch (err) {
        console.error('SNS publish error', err);
      }
    }
  }
  return {};
};

// simple DynamoDB JSON unmarshaller
function unmarshall(img) {
  if (!img) return {};
  const out = {};
  for (const k of Object.keys(img)) {
    const val = img[k];
    if (val.S !== undefined) out[k] = val.S;
    else if (val.N !== undefined) out[k] = Number(val.N);
    else if (val.BOOL !== undefined) out[k] = Boolean(val.BOOL);
    else out[k] = val;
  }
  return out;
}

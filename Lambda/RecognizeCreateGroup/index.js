const idgenerator = require('./idgenerator');
const response = require('./response');

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();


exports.handler = async (event, context, callback) => {
    console.log(event);
    const requestBody = JSON.parse(event.body);

    if (!event.requestContext.authorizer) {
      response.error('Authorization not configured', context.awsRequestId, callback);
      return;
    }
    
    const id = idgenerator.generate();
    console.log('Received event (', id, '): ', event);
    
    const user = event.requestContext.authorizer.claims['email'];
    if (!requestBody.name) {
        response.error('Group name is required', context.awsRequestId, callback);
    }
    const name = requestBody.name;
    try {
            const res = await putGroup(id, user, name);
            response.success(id, name, user, context.awsRequestId, callback);
        } catch (err) {
            response.error(err.message, context.awsRequestId, callback);
    }
    
};

function putGroup(id, user, name) {
    return ddb.put({
        TableName: 'RecognizeGroups',
        Item: {
            id: id,
            name: name,
            creator: user,
            attenders: [],
            moderators: []
        },
    }).promise();
}
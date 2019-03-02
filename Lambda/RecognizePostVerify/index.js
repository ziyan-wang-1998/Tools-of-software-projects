const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();


exports.handler = async (event, context, callback) => {
    console.log(event);
    
    
    if (event.request.userAttributes.email && event.request.userAttributes.given_name && event.request.userAttributes.family_name) {
        const email = event.request.userAttributes.email;
        const fname = event.request.userAttributes.given_name;
        const lname = event.request.userAttributes.family_name;
        
        try {
            const res = await putUser(email, fname, lname);
            callback(null, res);
        } catch (err) {
            callback(err, null);
        }
        
    } else {
        // Nothing to do, the user's email ID is unknown
        callback(null, event);
    }
};

function putUser(email, fname, lname) {
    return ddb.put({
        TableName: 'RecognizeUsers',
        Item: {
            email: email,
            fname: fname,
            lname: lname,
            groups_attending: [],
            groups_moderating: [],
            groups_created: []
        },
    }).promise();
}

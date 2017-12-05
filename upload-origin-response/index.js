'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

function addEntry(uuid, name, epoch) {
    console.log("uuid: " + uuid + ", name: " + name + ", epoch: " + epoch);
    
    var params = {
        TableName: "reInvent_2017_pics",
        Item: {
            "PictureID": { "S": uuid },
            "PictureName": { "S": name },
            "Epoch": { "N": JSON.stringify(epoch) }
        }
    };
    ddb.putItem(params, function (err, data) {
        console.log('err: ' + JSON.stringify(err));
        console.log('data: ' + JSON.stringify(data));
    });
}

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const response = event.Records[0].cf.response;

    if (request.method != "PUT" && request.method != "POST") {
        return callback(null, response);
    }

    /*
     * Add an entry in DDB.
     */
    if (request.headers['x-amz-meta-uuid'] && request.headers['x-amz-meta-original-filename']) {
        const uuid = request.headers['x-amz-meta-uuid'][0].value;
        const name = request.headers['x-amz-meta-original-filename'][0].value;
        const epoch = (new Date).getTime();
        addEntry(uuid, name, epoch);
    }

    callback(null, response);
};

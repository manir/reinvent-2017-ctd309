'use strict';

function b(a) {
    return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b);
};

function uuidv4() {
    return b();
}

exports.handler = function (event, context, callback) {
    const request = event.Records[0].cf.request;

    console.log("Event: " + JSON.stringify(event, null, 2));
    if (request.method != "PUT" && request.method != "POST") {
        return callback(null, request);
    }
    
    console.log("Received a " + request.method + " request. processing.");
    /*
     * 1. Change the object name to be the uuid
     * 2. Set a x-amz-meta-uuid header. We will use this to update DDB.
     */
    const uuid = uuidv4();
    console.log("UUID: " + uuid);
    console.log("callback: " + callback);
    
    const uri = request.uri;
    const arr = uri.split('/');
    const userGivenName = arr[arr.length - 1];
    arr[arr.length - 1] = uuid;
    request.uri = arr.join('/');
    
    request.headers['x-amz-meta-uuid'] = [{
        key: "x-amz-meta-uuid",
        value: uuid
    }];
    request.headers['x-amz-meta-original-filename'] = [{
        key: "x-amz-meta-original-filename",
        value: userGivenName
    }];
    
    console.log("New URI: " + request.uri);
    console.log("Request: " + JSON.stringify(request));

    callback(null, request);
};

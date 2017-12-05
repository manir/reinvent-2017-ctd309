'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

var htmlHeader = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CTD309 - Lambda@Edge Demo</title>
    <link rel="stylesheet" href="/style/style.css">
</head>
<body>

<p>Recent images</p>`;

var htmlFooter = `
</body>
</html>`;


function generateImageMatrix(data) {
    var html = "";

    for (var i=0; i < data.Count; i++) {
        const item = data.Items[i];
        const ref = "/upload/" + item.PictureID.S;
        html += "<a href=\"" + ref + "\" class=\"card_wrap\">";
        html += "<img class=\"card_img\" src=\"" + ref + "\" height=\"200\" width=\"200\">";
        html += "</a>";
        if (i % 2) {
            html += "</br>";
        }
    }
        
    return html;
}

function getDDBImages(callback) {
    const params = {
        TableName: "reInvent_2017_pics",
        Limit: 6,
    };

    ddb.scan(params, function(err, data) {
        if (err) {
            console.log("Error scanning table: " + JSON.stringify(err));
            generateIndexHTML({Count: 0}, callback);
        } else {
            console.log("Data: " + JSON.stringify(data));
            generateIndexHTML(data, callback);
        }
    });
}

function generateIndexHTML(data, callback) {
    const response = {
        status: '200',
        statusDescription: 'OK',
        headers: {
            'cache-control': [{
                key: 'Cache-Control',
                value: "max-age=30",
            }],
            'content-type': [{
                key: 'Content-Type',
                value: 'text/html',
            }],
        },
		body: String(htmlHeader + generateImageMatrix(data) + htmlFooter),
    };

    callback(null, response);
}


/* This is an origin request function */
exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    getDDBImages(callback);
};

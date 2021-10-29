const { Octokit } = require("@octokit/rest");

exports.handler = async (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    let body = JSON.parse(decodeURIComponent(event.body.substring(event.body.indexOf('=')+1)));

    const responseBody = {
        status: "success"
    };
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers":
            "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST",
        },
        body: JSON.stringify(responseBody),
    };
    callback(null, response);
};

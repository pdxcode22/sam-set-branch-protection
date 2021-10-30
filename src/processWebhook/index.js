const { Octokit } = require("@octokit/rest");
const crypto = require("crypto");
const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

exports.handler = async (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    
    if (validateJsonWebhook(event)) {
        console.log("Webhook signature valid");
        let body = JSON.parse(decodeURIComponent(event.body.substring(event.body.indexOf('=')+1)));

    } else {
        console.log("Webhook signature invalid");
    }
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

function validateJsonWebhook(event) {

    // calculate the signature
    const expectedSignature = "sha1=" +
        crypto.createHmac("sha1", process.env.SECRET)
            .update(event.body)
            .digest("hex");

    // compare the signature against the one in the request
    const signature = event.headers["X-Hub-Signature"];
    if (signature !== expectedSignature) {
        //throw new Error("Invalid signature.");
        return false;
    } else{
        return true;
    }

}

exports.validateJsonWebhook = validateJsonWebhook;
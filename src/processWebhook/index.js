const { Octokit } = require("@octokit/rest");
const crypto = require("crypto");

exports.handler = async (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    
    if (validateJsonWebhook(event)) {
        console.log("Webhook signature valid");
        let body = JSON.parse(decodeURIComponent(event.body.substring(event.body.indexOf('=')+1)));
        const octokit = new Octokit({
            auth: process.env.GH_TOKEN,
        });
        await octokit.rest.repos.updateBranchProtection({
            owner: body.repository.owner.login,
            repo: body.repository.name,
            branch: body.repository.default_branch,
            required_status_checks: null,
            enforce_admins: null,
            required_pull_request_reviews: {
                required_approving_review_count: 1
            },
            restrictions: {
                users: [],
                teams: []
            }
        });
        octokit.rest.issues.create({
            owner: body.repository.owner.login,
            repo: body.repository.name,
            title: "Branch protections added",
            body: `Branch protections added to this repo include:  \n - Require a pull request before merging  \n - Required number of approvals before merging: 1  \n - Restrict who can push to matching branches  \n@${process.env.NOTIFY_USER}`,
        });
        
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
    } else {
        var error = new Error("Webhook signature invalid. Make sure the stack secret matches the webhook secret!")
        context.fail(error);
    }
};

function validateJsonWebhook(event) {

    // calculate the signature
    const expectedSignature = "sha1=" +
        crypto.createHmac("sha1", process.env.SECRET)
            .update(event.body)
            .digest("hex");

    // compare the signature against the one in the event
    const signature = event.headers["X-Hub-Signature"];
    return (signature == expectedSignature)
}

exports.validateJsonWebhook = validateJsonWebhook;
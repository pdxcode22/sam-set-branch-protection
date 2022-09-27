const { Octokit } = require("@octokit/rest");
const crypto = require("crypto");

exports.handler = async (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    if (validateJsonWebhook(event)) {
        console.log("Webhook signature valid");
        let body = JSON.parse(decodeURIComponent(event.body.substring(event.body.indexOf('=')+1)));
        if (body.action == 'created') {
            const octokit = new Octokit({
                auth: process.env.GH_TOKEN,
            });
            await octokit.rest.repos.updateBranchProtection({
                owner: body.repository.owner.login,
                repo: body.repository.name,
                branch: body.repository.default_branch,
                required_status_checks: null,
                required_pull_request_reviews: {
                    dismiss_stale_reviews: process.env.DISMISS_STALE_REVIEWS  == 'true' ? true : false,
                    require_code_owner_reviews: process.env.REQUIRE_CODE_OWNER_REVIEWS == 'true' ? true : false,
                    required_approving_review_count: process.env.REQUIRED_APPROVING_REVIEW_COUNT ? parseInt(process.env.REQUIRED_APPROVING_REVIEW_COUNT) : null,
                },
                restrictions: {
                    users: [],
                    teams: []
                },
                enforce_admins: process.env.ENFORCE_ADMINS == 'true' ? true : false,
                required_linear_history: process.env.REQUIRED_LINEAR_HISTORY == 'true' ? true : false,
                allow_force_pushes: process.env.ALLOW_FORCE_PUSHES == 'true' ? true : false,
                allow_deletions: process.env.ALLOW_DELETIONS == 'true' ? true : false,
                block_creations: process.env.BLOCK_CREATIONS == 'true' ? true : false,
                required_conversation_resolution: process.env.REQUIRED_CONVERSATION_RESOLUTION == 'true' ? true : false,
            });
            octokit.rest.issues.create({
                owner: body.repository.owner.login,
                repo: body.repository.name,
                title: "Branch protections added",
                body: `Branch protections setting:  \n
 - Require a pull request before merging  \n
 - Dismiss stale pull request approvals when new commits are pushed: ${process.env.DISMISS_STALE_REVIEWS ? process.env.DISMISS_STALE_REVIEWS : false}  \n
 - Require review from Code Owners: ${process.env.REQUIRE_CODE_OWNER_REVIEWS ? process.env.REQUIRE_CODE_OWNER_REVIEWS : false}  \n
 - Required number of approvals before merging: ${process.env.REQUIRED_APPROVING_REVIEW_COUNT ? process.env.REQUIRED_APPROVING_REVIEW_COUNT : 0}  \n
 - Enforce Admins: ${process.env.ENFORCE_ADMINS ? process.env.ENFORCE_ADMINS : false}  \n
 - Require linear history: ${process.env.REQUIRED_LINEAR_HISTORY ? process.env.REQUIRED_LINEAR_HISTORY : false}  \n
 - Allow force pushes: ${process.env.ALLOW_FORCE_PUSHES ? process.env.ALLOW_FORCE_PUSHES : false}  \n
 - Allow deletions: ${process.env.ALLOW_DELETIONS ? process.env.ALLOW_DELETIONS : false}  \n
 - Restrict new branch creation: ${process.env.BLOCK_CREATIONS ? process.env.BLOCK_CREATIONS : false}  \n 
 - Enforce restrictions for administrators: ${process.env.ENFORCE_ADMINS ? process.env.ENFORCE_ADMINS : false}  \n
 - Require conversation resolution: ${process.env.REQUIRED_CONVERSATION_RESOLUTION ? process.env.REQUIRED_CONVERSATION_RESOLUTION : false}  \n
 @${process.env.NOTIFY_USER}`,
            });
        } else {
            console.log("Not the event we are looking for...");
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
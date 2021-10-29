# sam-set-branch-protection

This is a [SAM app](https://aws.amazon.com/serverless/sam/) which consists of an [API Gateway](https://aws.amazon.com/api-gateway/) and a [Lambda](https://aws.amazon.com/lambda/)

The lambda receives a payload from the Github 

## Deploying the stack

1. [Install AWS sam cli](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
1. Setup creds in AWS for cli with a profile called mylm
1. run `export AWS_PROFILE=<your profile>`
1. run `sam build`
1. run `sam deploy --guided`

Subsequent deploys to the same stack to the default environment...

1. run `sam build`
1. run `sam deploy`

## Setup Github webhook
1. Go to your Org webhook settings in GitHub. `https://github.com/organizations/<your org name>/settings/hooks`
2. Click `Add webhook`
3. Use the cloudformation output value for key=processWebhookApiEndpoint as the `Payload URL`
4. Choose `Let me select individual events.`
5. Deselect `Pushes`
6. Select `Repositories`
7. Click `Add webhook` at the bottom of the page

## Running:
 `sam local invoke processWebhook -n vars.json -e src/processWebhook/event.json`

 ## Debugging:
`sam local invoke -d 9999 processWebhook -n vars.json -e src/processWebhook/event.json`
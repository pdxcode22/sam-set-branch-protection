# sam-set-branch-protection

This is a [SAM app](https://aws.amazon.com/serverless/sam/) which consists of an [API Gateway](https://aws.amazon.com/api-gateway/) and a [Lambda](https://aws.amazon.com/lambda/)

The lambda receives a payload from the Github 

## Deploying the stack

1. [Install AWS sam cli](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
2. Setup creds in AWS for cli with a profile
3. run `export AWS_PROFILE=<your profile>`
4. run `sam build`
5. run `sam deploy --guided`

Subsequent deploys to the same stack to the default environment...

1. run `sam build`
1. run `sam deploy`

## CI/CD
Add the following secrets to your repo to deploy the stack via GitHub actions:  
AWS_ACCESS_KEY_ID  
AWS_SECRET_ACCESS_KEY  
SECRET  ## Shared secret used in webhook  
GH_TOKEN  ## Personal GitHub access token  

## Setup Github webhook
1. Go to your Org webhook settings in GitHub. `https://github.com/organizations/<your org name>/settings/hooks`
2. Click `Add webhook`
3. Use the cloudformation output value for key=processWebhookApiEndpoint as the `Payload URL`
4. Use the same secret used in the stack deployment
5. Choose `Let me select individual events.`
6. Deselect `Pushes`
7. Select `Repositories`
8. Click `Add webhook` at the bottom of the page

## Running:
 `sam local invoke processWebhook -n vars.json -e src/processWebhook/event.json`

 ## Debugging:
`sam local invoke -d 9999 processWebhook -n vars.json -e src/processWebhook/event.json`  
Then in VSCode run the `Attach to lambda` profile
# Node Chat Sample

This is a sample Node site, showing off several features such as:
 - socket.io
 - express

It's designed to be deployed to Azure Web Apps as a sample.

## Dependencies

 - node: 4.2.1
 - npm: 3.3.9
 - bower: 1.6.5


## Run Locally

1. `$> npm install`
2. `$> bower install`
3. `$> npm start`

There is also typing support for the client JS SDKs. You can install them with:

 - `$> tsd install`


## Deploy

Press this button below to deploy this sample into an Azure Web App.

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://azuredeploy.net/)

Optionally, you can deploy this sample yourself into an App you've already provisioned by cloning this repository and deploying via git yourself.

You can customize deployment via the deploy.cmd file. I've customized this script to do bower installation after install.

## LICENSE

 [MIT](./LICENSE)

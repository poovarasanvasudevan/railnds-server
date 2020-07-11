const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const {default: ParseServer, ParseGraphQLServer} = require('parse-server');
const ParseDashboard = require('parse-dashboard');
const AvatarGenerator = require('avatar-generator');
const RedisCacheAdapter = require('parse-server').RedisCacheAdapter;

const app = express();
const avatar = new AvatarGenerator({
    parts: ['background', 'face', 'clothes', 'head', 'hair', 'eye', 'mouth']
});


//const redisOptions = {url: 'redis://localhost:6379/'};
//const redisCache = new RedisCacheAdapter(redisOptions);

const parseServer = new ParseServer({
    databaseURI: 'mongodb://localhost:27017/dev', // Connection string for your MongoDB database
    cloud: './cloud/main.js', // Absolute path to your Cloud Code
    appId: 'myAppId',
    masterKey: 'myMasterKey', // Keep this key secret!
    fileKey: 'optionalFileKey',
    javascriptKey: "jskey",
    serverURL: 'http://localhost:1337/parse',
   // cacheAdapter: redisCache,
    liveQuery: {
        classNames: ['ChatMessages', 'User', "Group"]
    }
});
var dashboard = new ParseDashboard({
    "apps": [
        {
            "serverURL": "http://localhost:1337/parse",
            "appId": "myAppId",
            "masterKey": "myMasterKey",
            "appName": "MyApp",
            "javascriptKey": "jskey"
        }
    ]
});

const parseGraphQLServer = new ParseGraphQLServer(
    parseServer,
    {
        graphQLPath: '/graphql',
        playgroundPath: '/playground'
    }
);
// Serve the Parse API on the /parse URL prefix
app.use('/parse', parseServer.app);
app.use('/dashboard', dashboard);


app.get("/avatar", async (req, res) => {
    const variant = 'male';
    const image = await avatar.generate(req.query.email, variant);
    image.webp().pipe(res);
});

parseGraphQLServer.applyGraphQL(app);
parseGraphQLServer.applyPlayground(app);

let httpServer = require('http').createServer(app);

httpServer.listen(1337, '0.0.0.0', function () {
    console.log('parse-server-example running on port 1337.');
});

var parseLiveQueryServer = ParseServer.createLiveQueryServer(httpServer);

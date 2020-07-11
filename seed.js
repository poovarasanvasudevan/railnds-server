var faker = require('faker');
const Parse = require("parse/node")
Parse.initialize("myAppId", "jskey","myMasterKey");
//javascriptKey is required only if you have it on server.

Parse.serverURL = 'http://localhost:1337/parse'

async function doWork() {
    for (var i = 0; i < 500; i++) {
        const username = faker.internet.userName() + "" + i
        var user = new Parse.User();
        user.set("username", username);
        user.set("password", "password");
        user.set("email", faker.internet.email());
        user.set("first_name", faker.name.firstName());
        user.set("last_name", faker.name.lastName());

        try {
            await user.signUp();
            console.log(username)
            // Hooray! Let them use the app now.
        } catch (error) {
            // Show the error message somewhere and let the user try again.
            console.log("Error: " + error.code + " " + error.message);
        }

    }
}


doWork()

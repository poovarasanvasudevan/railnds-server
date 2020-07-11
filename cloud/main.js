Parse.Cloud.define("runQuery", (data) => {
})

Parse.Cloud.beforeSave("ChatMessages", async (request) => {

    const message = request.object

    const acl = new Parse.ACL();
    acl.setWriteAccess(request.object.get("from"), true)
    acl.setReadAccess(request.object.get("from"), true)
    acl.setReadAccess(request.object.get("to"), true)

    acl.setRoleReadAccess("ADMIN",true)
    acl.setRoleWriteAccess("ADMIN",true)

    request.object.setACL(acl)


    if (!message.isNew() && message.dirty("text_message")) {

        const ChatMessageHistory = Parse.Object.extend("ChatMessageHistory");
        const history = new ChatMessageHistory();
        history.set("message", message.id)

        const query = new Parse.Query("ChatMessages");
        const resOld = await query.get(message.id, {useMasterKey: true});

        console.log(resOld)

        history.set("text", resOld.get("text_message"))
        await history.save(null, {useMasterKey: true})

        request.object.set("is_edited", true)
        console.log("Saved")
    }

    console.log("message sended")
})

isOwner = (ClientApplication, msg, args) => ClientApplication.owner.id == msg.author.id;
returnFalse = (ClientApplication, msg, args) => false;
argsExist = (ClientApplication, msg, args) => args.length;
cleanArgsExist = (ClientApplication, msg, args) => args.join("").replace(/[^\x00-\x7F]/g, "").length;
tagsExist = (ClientApplication, msg, args) => Object.keys(msg.tags).length;
cleanTagsExist = (ClientApplication, msg, args) => Object.keys(msg.tags).filter(key => key.replace(/[^\x00-\x7F]/g, "").length).length;
cleanArgsOrTagsExist = (ClientApplication, msg, args) => cleanArgsExist("", "", args) || cleanTagsExist("", msg, "");


module.exports = {
    isOwner,
    returnFalse,
    argsExist,
    cleanArgsExist,
    tagsExist,
    cleanTagsExist,
    cleanArgsOrTagsExist,
};
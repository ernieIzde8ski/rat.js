is_owner = (ClientApplication, msg, args) => ClientApplication.owner.id == msg.author.id;
return_false = (ClientApplication, msg, args) => false;
argsExist = (ClientApplication, msg, args) => args.length;
cleanArgsExist = (ClientApplication, msg, args) => args.join("").replace(/[^\x00-\x7F]/g, "").length;
tagsExist = (ClientApplication, msg, args) => Object.keys(msg.tags).length;
cleanTagsExist = (ClientApplication, msg, args) => Object.keys(msg.tags).filter(key => key.replace(/[^\x00-\x7F]/g, "").length).length;
cleanArgsOrTagsExist = (ClientApplication, msg, args) => cleanArgsExist("", "", args) || cleanTagsExist("", msg, "");


wrap = str => "`" + str + "`";
// if command is valid: returns empty string
failedChecks = (checks = [], ClientApplication, msg, args) => {
    // filter out 
    checks = checks.filter(check => !check(ClientApplication, msg, args));
    return checks.map(check => wrap(check.name)).join(", ")
}


module.exports = {
    is_owner: is_owner,
    return_false: return_false,
    argsExist: argsExist,
    cleanArgsExist: cleanArgsExist,
    tagsExist: tagsExist,
    cleanTagsExist,
    cleanArgsOrTagsExist,
}
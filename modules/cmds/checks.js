is_owner = (ClientApplication, msg, args) => ClientApplication.owner.id == msg.author.id;
argsExist = (ClientApplication, msg, args) => args.length;
cleanArgsExist = (ClientApplication, msg, args) => args.join("").replace(/[^\x00-\x7F]/g, "").length;
return_false = (ClientApplication, msg, args) => false;


wrap = str => "`" + str + "`";
// if command is valid: returns empty string
failedChecks = (checks = [], ClientApplication, msg, args) => {
    // filter out 
    checks = checks.filter(check => !check(ClientApplication, msg, args));
    return checks.map(check => wrap(check.name)).join(", ")
}


module.exports = {
    is_owner: is_owner,
    argsExist: argsExist,
    cleanArgsExist: cleanArgsExist,
    return_false: return_false,
}
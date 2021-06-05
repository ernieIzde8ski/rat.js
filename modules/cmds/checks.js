is_owner = (ClientApplication, msg, args) => ClientApplication.owner.id == msg.author.id;
return_false = (ClientApplication, msg, args) => false;

module.exports = {is_owner: is_owner, return_false: return_false}
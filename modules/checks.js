is_owner = (ClientApplication, msg) => ClientApplication.owner.id == msg.author.id;
return_false = (ClientApplication, msg) => false;

module.exports = {is_owner: is_owner, return_false: return_false}
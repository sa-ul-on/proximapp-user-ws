const hashing = require('../utils/hashing');
const Invite = require('../entity/Invite');
const User = require('../entity/User');

module.exports = {
	setUserRepo: function (userRepo) {
		this.userRepo = userRepo;
	},
	setInviteRepo: function (inviteRepo) {
		this.inviteRepo = inviteRepo;
	},
	createInvite: async function (email, roles, companyId) {
		const alr = await this.userRepo.findUsersByQuery(null, email);
		if (alr != null && alr.length > 0)
			return null;
		const invite = new Invite();
		invite.email = email;
		invite.roles = roles;
		invite.companyId = companyId;
		return await this.inviteRepo.createInvite(invite);
	},
	findInvitesByCompany: async function (companyId) {
		return await this.inviteRepo.findInvitesByCompany(companyId);
	},
	acceptInvite: async function (inviteId, companyId, password) {
		if (password.length < 6)
			return null;
		const invite = await this.inviteRepo.findInviteById(inviteId, companyId);
		if (!invite)
			return null;
		let user = new User();
		user.email = invite.email;
		user.password = hashing(password);
		user.roles = invite.roles;
		user.companyId = invite.companyId;
		user = await this.userRepo.createUser(user);
		if (!user)
			return null;
		const status = await this.inviteRepo.deleteInvite(invite.id, invite.companyId);
		if (!status) // TODO: transaction
			return null;
		return user;
	},
	refuseInvite: async function (inviteId, companyId) {
		return await this.inviteRepo.deleteInvite(inviteId, companyId);
	}
};

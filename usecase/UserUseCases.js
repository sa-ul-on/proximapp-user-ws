const hashing = require('../utils/hashing');

module.exports = {
	setUserRepo: function (userRepo) {
		this.userRepo = userRepo;
	},
	findUsersByCompany: async function (companyId) {
		return await this.userRepo.findUsersByQuery(companyId);
	},
	findUserByCredentials: async function (email, password) {
		const hashedPwd = hashing(password);
		const users = await this.userRepo.findUsersByQuery(null, email, hashedPwd);
		if (users && users.length === 1)
			return users[0];
		else
			return null;
	},
	findUserById: async function (userId, companyId) {
		return await this.userRepo.findUserById(userId, companyId);
	},
	updateUserPassword: async function (userId, companyId, oldPassword, newPassword) {
		const user = await this.userRepo.findUserById(userId, companyId);
		if (!user)
			return null;
		const hashedOldPwd = hashing(oldPassword);
		if (user.password !== hashedOldPwd)
			return null;
		const hashedNewPwd = hashing(newPassword);
		if (newPassword.length < 6 || hashedNewPwd === hashedOldPwd)
			return null;
		user.password = hashedNewPwd;
		return await this.userRepo.updateUser(user);
	},
	deleteUser: async function (userId, companyId) {
		return await this.userRepo.deleteUser(userId, companyId)
	}
};

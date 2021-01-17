const assert = require('assert');
const hashing = require("../utils/hashing");

const dbConn = require("../db/DbConn");
const pgClient = dbConn();
const postgresCompanyRepo = require("../db/PostgresCompanyRepo");
const postgresInviteRepo = require("../db/PostgresInviteRepo");
const postgresUserRepo = require("../db/PostgresUserRepo");
postgresCompanyRepo.setPgClient(pgClient);
postgresInviteRepo.setPgClient(pgClient);
postgresUserRepo.setPgClient(pgClient);
const companyUseCases = require("../usecase/CompanyUseCases");
companyUseCases.setCompanyRepo(postgresCompanyRepo);
const inviteUseCases = require("../usecase/InviteUseCases");
inviteUseCases.setInviteRepo(postgresInviteRepo);
inviteUseCases.setUserRepo(postgresUserRepo);
const userUseCases = require("../usecase/UserUseCases");
userUseCases.setUserRepo(postgresUserRepo);

describe("test1", function () {
	it("test1.1", async function () {
		// Company creation
		const c1 = {name: "Company #1", address: "C#1 address"};
		const company = await companyUseCases.createCompany(c1.name, c1.address);
		assert.notEqual(company, null);
		assert.equal(company.name, c1.name);
		assert.equal(company.address, c1.address);

		const companyRead = await companyUseCases.findCompanyById(company.id);
		assert.equal(company.id, companyRead.id);
		assert.equal(company.name, companyRead.name);
		assert.equal(company.address, companyRead.address);

		// Invite 1
		const i1 = {email: 'email1@email.x', roles: ['employee'], companyId: company.id};
		const invite1Insertion1 = await inviteUseCases.createInvite(i1.email, i1.roles, i1.companyId);
		assert.notEqual(invite1Insertion1, null);
		assert.equal(invite1Insertion1.email, i1.email);
		assert.deepEqual(invite1Insertion1.roles, i1.roles);
		assert.equal(invite1Insertion1.companyId, company.id);
		const invite1Insertion1_2 = await inviteUseCases.createInvite(i1.email, i1.role, i1.companyId);
		assert.equal(invite1Insertion1_2, null);

		const statusInvite1Refuse1 = await inviteUseCases.refuseInvite(invite1Insertion1.id, invite1Insertion1.companyId);
		assert.strictEqual(statusInvite1Refuse1, true);
		const statusInvite1Refuse2 = await inviteUseCases.refuseInvite(invite1Insertion1.id, invite1Insertion1.companyId);
		assert.strictEqual(statusInvite1Refuse2, false);

		const invite1Insertion2 = await inviteUseCases.createInvite(i1.email, i1.roles, i1.companyId);
		assert.notEqual(invite1Insertion2, null);
		assert.equal(invite1Insertion2.email, i1.email);
		assert.deepEqual(invite1Insertion2.roles, i1.roles);
		assert.equal(invite1Insertion2.companyId, company.id);

		// User creation
		const u1 = {inviteId: invite1Insertion2.id, companyId: invite1Insertion2.companyId, password: 'passwd'};
		const user = await inviteUseCases.acceptInvite(u1.inviteId, u1.companyId, u1.password);
		assert.notEqual(user, null);
		assert.equal(user.email, i1.email);
		assert.deepEqual(user.roles, i1.roles);
		assert.equal(user.password, hashing(u1.password));
		assert.equal(user.companyId, u1.companyId);
		const userAcceptTwice = await inviteUseCases.acceptInvite(u1.inviteId, u1.companyId, u1.password);
		assert.equal(userAcceptTwice, null);
		const invite1Insertion3 = await inviteUseCases.createInvite(i1.email, i1.roles, i1.companyId);
		assert.equal(invite1Insertion3, null);
		const userRead = await userUseCases.findUserById(user.id, user.companyId);
		assert.equal(user.id, userRead.id);
		assert.equal(user.email, userRead.email);
		assert.equal(user.password, userRead.password);
		assert.deepEqual(user.roles, userRead.roles);
		assert.equal(user.companyId, userRead.companyId);

		// User deletion
		const statusUserDeletion1 = await userUseCases.deleteUser(user.id, user.companyId);
		assert.strictEqual(statusUserDeletion1, true);
		const statusUserDeletion2 = await userUseCases.deleteUser(user.id, user.companyId);
		assert.strictEqual(statusUserDeletion2, false);

		// Company deletion
		const status = await companyUseCases.deleteCompany(company.id);
		assert.strictEqual(status, true);
	});
});

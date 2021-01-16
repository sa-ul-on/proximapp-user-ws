"use strict";

const dbConn = require("../db/dbConn");
const pgClient = dbConn();
const postgresUserRepo = require("../db/postgres_user_repo");
const postgresInviteRepo = require("../db/postgres_invite_repo");
postgresUserRepo.setPgClient(pgClient);
postgresInviteRepo.setPgClient(pgClient);
const inviteUseCases = require("../usecase/invite_use_cases");
inviteUseCases.setUserRepo(postgresUserRepo);
inviteUseCases.setInviteRepo(postgresInviteRepo);

module.exports = function (app) {

	app.route("/invites/:companyId").post(async function (req, resp) {
		const companyId = req.params.companyId;
		const email = req.query.email;
		const roles = req.query.roles.split(",");
		const invite = await inviteUseCases.createInvite(email, roles, companyId);
		resp.json(invite);
	});

	app.route("/invites/:companyId/query").get(async function (req, resp) {
		const companyId = req.params.companyId;
		const invites = await inviteUseCases.findInvitesByCompany(companyId);
		resp.json(invites);
	});

	app.route("/invites/:companyId/:inviteId").put(async function (req, resp) {
		const companyId = req.params.companyId;
		const inviteId = req.params.inviteId;
		const acceptOrNot = req.query.accept_or_not;
		const password = req.query.password;
		if (acceptOrNot === "accept") {
			const user = await inviteUseCases.acceptInvite(inviteId, companyId, password);
			resp.json(user);
		} else {
			const status = await inviteUseCases.refuseInvite(inviteId, companyId);
			resp.json(status);
		}
	});

};

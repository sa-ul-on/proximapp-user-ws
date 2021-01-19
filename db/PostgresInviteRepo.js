const Invite = require('../entity/Invite');

module.exports = {
	setPgClient: function (pgClient) {
		this.pgClient = pgClient;
	},
	createInvite: async function (invite) {
		const query = 'INSERT INTO invites (email, company_id, roles) VALUES ($1, $2, $3) RETURNING id';
		try {
			const res = await this.pgClient.query(query, [invite.email, invite.companyId, invite.roles.join(',')]);
			const lastInsertedId = res.rows[0].id;
			return this.findInviteById(lastInsertedId);
		} catch (err) {
			return null;
		}
	},
	findInvitesByCompany: async function (companyId) {
		const query = 'SELECT id, email, company_id, roles FROM invites WHERE company_id = $1';
		try {
			const res = await this.pgClient.query(query, [companyId]);
			const invites = [];
			for (const row of res.rows) {
				const invite = new Invite();
				invite.id = row.id;
				invite.email = row.email;
				invite.companyId = row.company_id;
				invite.roles = row.roles.split(',');
				invites.push(invite);
			}
			return invites;
		} catch (err) {
			return null;
		}
	},
	findInviteById: async function (inviteId) {
		const query = 'SELECT id, email, company_id, roles FROM invites WHERE id = $1';
		try {
			const res = await this.pgClient.query(query, [inviteId]);
			const row = res.rows[0];
			const invite = new Invite();
			invite.id = row.id;
			invite.email = row.email;
			invite.companyId = row.company_id;
			invite.roles = row.roles.split(',');
			return invite;
		} catch (err) {
			return null;
		}
	},
	deleteInvite: async function (inviteId, companyId) {
		const query = 'DELETE FROM invites WHERE id = $1 AND company_id = $2';
		try {
			const res = await this.pgClient.query(query, [inviteId, companyId]);
			return res.rowCount === 1;
		} catch (err) {
			return false;
		}
	}
};

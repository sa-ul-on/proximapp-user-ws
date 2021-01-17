const User = require("../entity/User");

module.exports = {
	setPgClient: function (pgClient) {
		this.pgClient = pgClient;
	},
	createUser: async function (user) {
		const query = "INSERT INTO users (email, password, company_id, roles) VALUES ($1, $2, $3, $4) RETURNING id";
		try {
			const res = await this.pgClient.query(query, [user.email, user.password, user.companyId, user.roles.join(",")]);
			const lastId = res.rows[0].id;
			return this.findUserById(lastId, user.companyId);
		} catch (err) {
			return null;
		}
	},
	findUsersByQuery: async function (companyId, email, password) {
		let query = "SELECT id, email, password, company_id, roles FROM users WHERE ";
		let args = [];
		if (companyId != null) {
			query += "company_id = $" + (args.length + 1) + " AND ";
			args.push(companyId);
		}
		if (email != null) {
			query += "email = $" + (args.length + 1) + " AND ";
			args.push(email);
		}
		if (password != null) {
			query += "password = $" + (args.length + 1) + " AND ";
			args.push(password);
		}
		query = query.substr(0, query.length - 5);
		try {
			const res = await this.pgClient.query(query, args);
			const users = [];
			for (const row of res.rows) {
				const user = new User();
				user.id = row.id;
				user.email = row.email;
				user.password = row.password;
				user.companyId = row.company_id;
				user.roles = row.roles.split(",");
				users.push(user);
			}
			return users;
		} catch (err) {
			return null;
		}
	},
	findUserById: async function (userId, companyId) {
		const query = "SELECT id, email, password, company_id, roles FROM users WHERE id = $1 AND company_id = $2";
		try {
			const res = await this.pgClient.query(query, [userId, companyId]);
			if (res.rowCount !== 1)
				return null;
			const user = new User();
			user.id = res.rows[0].id;
			user.email = res.rows[0].email;
			user.password = res.rows[0].password;
			user.roles = res.rows[0].roles.split(",");
			user.companyId = res.rows[0].company_id;
			return user;
		} catch (e) {
			return null;
		}
	},
	updateUser: async function (user) {
		const query = "UPDATE users SET password = $1 WHERE id = $2 AND company_id = $3";
		try {
			const res = await this.pgClient.query(query, [user.password, user.id, user.companyId]);
			if (res.rowCount === 1)
				return this.findUserById(user.id, user.companyId);
			else
				return null;
		} catch (e) {
			return null;
		}
	},
	deleteUser: async function (userId, companyId) {
		const query = "DELETE FROM users WHERE id = $1 AND company_id = $2";
		try {
			const res = await this.pgClient.query(query, [userId, companyId]);
			return res.rowCount === 1;
		} catch (err) {
			return null;
		}
	}
};

const Company = require('../entity/Company');

module.exports = {
	setPgClient: function (pgClient) {
		this.pgClient = pgClient;
	},
	createCompany: async function (company) {
		const query = 'INSERT INTO companies (name, address) VALUES ($1, $2) RETURNING id';
		try {
			const res = await this.pgClient.query(query, [company.name, company.address]);
			const lastInsertedId = res.rows[0].id;
			return this.findCompanyById(lastInsertedId);
		} catch (err) {
			return null;
		}
	},
	findAllCompanies: async function () {
		const query = 'SELECT id, name, address FROM companies';
		try {
			const res = await this.pgClient.query(query);
			const companies = [];
			for (const row of res.rows) {
				const company = new Company();
				company.id = row.id;
				company.name = row.name;
				company.address = row.address;
				companies.push(company);
			}
			return companies;
		} catch (err) {
			return null;
		}
	},
	findCompanyById: async function (companyId) {
		const query = 'SELECT id, name, address FROM companies WHERE id = $1';
		try {
			const res = await this.pgClient.query(query, [companyId]);
			const row = res.rows[0];
			const company = new Company();
			company.id = row.id;
			company.name = row.name;
			company.address = row.address;
			return company;
		} catch (err) {
			return null;
		}
	},
	deleteCompany: async function (companyId) {
		const query = 'DELETE FROM companies WHERE id = $1';
		try {
			const res = await this.pgClient.query(query, [companyId]);
			return res.rowCount === 1;
		} catch (err) {
			return false;
		}
	}
};

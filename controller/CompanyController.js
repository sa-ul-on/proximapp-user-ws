'use strict';

const dbConn = require('../db/DbConn');
const pgClient = dbConn();
const postgresCompanyRepo = require('../db/PostgresCompanyRepo');
postgresCompanyRepo.setPgClient(pgClient);
const companyUseCases = require('../usecase/CompanyUseCases');
companyUseCases.setCompanyRepo(postgresCompanyRepo);

module.exports = function (app) {

	app.route('/companies').post(async function (req, resp) {
		const name = req.body.name;
		const address = req.body.address;
		const company = await companyUseCases.createCompany(name, address);
		resp.json(company);
	});

	app.route('/companies').get(async function (req, resp) {
		const company = await companyUseCases.findAllCompanies();
		resp.json(company);
	});

	app.route('/companies/:companyId').get(async function (req, resp) {
		const companyId = req.params.companyId;
		const company = await companyUseCases.findCompanyById(companyId);
		resp.json(company);
	});

	app.route('/companies/:companyId').delete(async function (req, resp) {
		const companyId = req.params.companyId;
		const status = await companyUseCases.deleteCompany(companyId);
		resp.json(status);
	});

};

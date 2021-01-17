const Company = require("../entity/Company");

module.exports = {
	setCompanyRepo: function (companyRepo) {
		this.companyRepo = companyRepo;
	},
	createCompany: async function (name, address) {
		const company = new Company();
		company.name = name;
		company.address = address;
		return await this.companyRepo.createCompany(company);
	},
	findAllCompanies: async function () {
		return await this.companyRepo.findAllCompanies();
	},
	findCompanyById: async function (companyId) {
		return await this.companyRepo.findCompanyById(companyId);
	},
	deleteCompany: async function (companyId) {
		return await this.companyRepo.deleteCompany(companyId)
	}
};

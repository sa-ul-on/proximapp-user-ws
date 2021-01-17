const pg = require("pg");

module.exports = function () {
	const pgConnUri = "postgres://iamhgonv:9HVAdeneNse84e6Jb4LTKD_Z3SC7XRll@kandula.db.elephantsql.com:5432/iamhgonv";
	const pgClient = new pg.Client(pgConnUri);
	pgClient.connect(function (err) {
		if (err) {
			return console.error("could not connect to postgres", err);
		}
	});
	return pgClient;
};

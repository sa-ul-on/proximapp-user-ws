'use strict';

const dbConn = require('../db/DbConn');
const pgClient = dbConn();
const postgresUserRepo = require('../db/PostgresUserRepo');
postgresUserRepo.setPgClient(pgClient);
const userUseCases = require('../usecase/UserUseCases');
userUseCases.setUserRepo(postgresUserRepo);

module.exports = function (app) {

    app.route('/users/:companyId').get(async function (req, resp) {
        const companyId = req.params.companyId;
        const users = await userUseCases.findUsersByCompany(companyId);
        resp.json(users);
    });

    app.route('/users/login').post(async function (req, resp) {
        const email = req.body.email;
        const password = req.body.password;
        const user = await userUseCases.findUserByCredentials(email, password);
        resp.json(user);
    });

    app.route('/users/:companyId/:userId').get(async function (req, resp) {
        const companyId = req.params.companyId;
        const userId = req.params.userId;
        const user = await userUseCases.findUserById(userId, companyId);
        resp.json(user);
    });

    app.route('/users/:companyId/:userId').put(async function (req, resp) {
        const companyId = req.params.companyId;
        const userId = req.params.userId;
        const oldPassword = req.body.old_password;
        const newPassword = req.body.new_password;
        const user = await userUseCases.updateUserPassword(userId, companyId, oldPassword, newPassword);
        resp.json(user);
    });

    app.route('/users/:companyId/:userId').delete(async function (req, resp) {
        const companyId = req.params.companyId;
        const userId = req.params.userId;
        const status = await userUseCases.deleteUser(userId, companyId);
        resp.json(status);
    });

};

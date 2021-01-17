const express = require("express")
const app = express();

const companyController = require("./controller/CompanyController");
companyController(app);

const userController = require("./controller/UserController");
userController(app);

const inviteController = require("./controller/InviteController");
inviteController(app);

const port = process.env.PORT || 3000;
app.listen(port);

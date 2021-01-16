const express = require("express")
const app = express();

const userController = require("./controller/user_controller");
userController(app);

const inviteController = require("./controller/invite_controller");
inviteController(app);

const port = process.env.PORT || 3000;
app.listen(port);

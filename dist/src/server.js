"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
require("reflect-metadata");
require("tsconfig-paths/register");
const _app = require("./app");
const _validateEnv = require("./utils/validateEnv");
const _homeroute = require("./routes/home.route");
const _userroute = require("./routes/user.route");
const _adminroute = require("./routes/admin.route");
const _roleroute = require("./routes/role.route");
const _permissionroute = require("./routes/permission.route");
(0, _validateEnv.ValidateEnv)();
const app = new _app.App([
    new _homeroute.HomeRoute(),
    new _roleroute.RoleRoute(),
    new _permissionroute.PermissionRoute(),
    new _adminroute.AdminRoute(),
    new _userroute.UserRoute()
]);
app.listen();

//# sourceMappingURL=server.js.map
const middlewares = require("../middlewares/error");
const heroes = require("../routes/api/heroes");
const teams = require("../routes/api/teams"); 

module.exports = app => {
  app.use("/api/heroes", heroes);
  app.use("/api/teams", teams);
  app.use(middlewares.notFound);
  app.use(middlewares.errorHandler);
};

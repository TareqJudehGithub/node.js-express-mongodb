//core modules
const path = require("path");

//Express Server setup
const express = require("express");
const app = express();

//database connection pool:
const mongoConnect = require("./util/database").mongoConnect;

//EJS 1. setup:
app.set("view engine", "ejs");
app.set("views", "views"); //for the views folder

//Routes:
const adminRoute = require("./routes/admin");
// const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/404");

//middlwares:
app.use(express.urlencoded( {extended: false }));

app.use((req, res, next) => {
    next();
});

//static files path: to grant access to other folders:
app.use(express.static(path.join(__dirname, "/public")));

//end-points:
app.use(adminRoute);
// app.use(shopRoutes);

//Error page not found for undefined routes.
app.use(errorController.get404);

mongoConnect(() => {
   
     app.listen(4000, () => {
          app.listen()
          ?
          console.log("Server is up and running on PORT 4000!")
          :
          console.log("Error starting Express server.")
     });
});






const express = require("express");
const next = require("next");
const cookieParser = require('cookie-parser');
const passport = require('passport'); //OAuth

require('dotenv').config()

const PORT = /*process.env.PORT || */8000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

require('./functions/mongoose.js'); //INIT DB
require('./functions/googleStrategy.js'); //GOOGLE STRATEGY
//require("./functions/emails/dailyEmail/CronJob.js"); //Daily Email CronJob

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(cookieParser());
    server.use(express.json());
    server.use(passport.initialize()); //OAuth
    
    // give all request to Nextjs server
    server.get('/_next/*', (req, res) => {
        handle(req, res);
    });

    const showRoutes = require("./routes/api.js");
    const authRoutes = require("./routes/auth.js")

    server.use("/api", showRoutes(server));
    server.use("/auth", authRoutes(server));

    /*ADDING A API ROUTE
    server.get("/api/shows", async(req,res)=>{

    })
    */

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, err => {
      if (err) throw err;
      console.log(`> Ready on ${PORT}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
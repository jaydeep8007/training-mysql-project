import dotenv from "dotenv";
dotenv.config();

import express from "express";
import logger from "morgan";
import { get } from "./config/config";

import bodyParser from "body-parser";
import cors from "cors"; //For cross domain error

import cookieParser from "cookie-parser";

//db connections
import sequelize from "./config/sequelize";

/* MAIN ROUTES */
import router from "./routes/main.route";

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Middleware
// app.use(cors());
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"] }));
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

app.use(express.json());
app.use(logger("dev"));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(logger("combined")); // Just uncomment this line to show logs.

/* =======   Settings for CORS ========== */
app.use((req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// app.use(timeout(120000));
app.use(haltOnTimedout);

function haltOnTimedout(req: any, res: any, next: any) {
  if (!req.timedout) next();
}

/* MAIN ROUTES FOR APP */
app.use("/api/v1", router);

// Server Start
const PORT = process.env.PORT || 3000;
/* REQUIRE DATABASE CONNECTION */

/* CONNECT DATABASE AND START THE SERVER */
// app.listen(PORT, async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Database connection has been established successfully.');

//         /* SYNC THE MODELS (create tables if they don't exist) */
//         await sequelize.sync({ alter: true })
//   .then(() => console.log("Database synced"))
//   .catch(err => console.error("Sync error:", err));; // Use { force: true } to drop and recreate tables
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
//     console.log("App is listing on port " + PORT + " for Fuse2 node server")
// });

import models from "./models/index"; // Import your models with associations

app.listen(PORT, async () => {
  try {
    await models.sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");

    // Sync all models and associations
    await models.sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database or sync:", error);
  }

  console.log(`🚀 App is listening on port ${PORT} for demo Node server`);
});

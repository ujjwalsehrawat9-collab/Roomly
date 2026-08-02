if (process.env.NODE_ENV != "production") {
  require("dotenv").config({
    path: require("path").join(__dirname, "..", ".env"),
  });
}

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL;

async function initDB() {
  try {
    if (!MONGO_URL) {
      throw new Error("ATLASDB_URL is missing from .env");
    }

    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    await Listing.deleteMany({});

    const data = initData.data.map((obj) => ({
      ...obj,
      owner: "683d55802cf2ad3dd9324232",
    }));

    await Listing.insertMany(data);

    console.log("✅ Data was initialized");

    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
  } catch (err) {
    console.error(err);
  }
}

initDB();
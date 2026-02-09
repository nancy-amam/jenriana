/**
 * One-off script: deletes apartments that were created by the seed (identified by placehold.co in gallery).
 * Run from project root: npx tsx scripts/delete-seed-apartments.ts
 * Ensure .env has MONGODB_URI set.
 */
import "dotenv/config";
import mongoose from "mongoose";
import Apartment from "../src/models/apartment";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in environment. Add it to .env");
  process.exit(1);
}

async function deleteSeedApartments() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!, { bufferCommands: false });
  console.log("Connected.\nFinding apartments with placehold.co in gallery (seed data)...");

  const result = await Apartment.deleteMany({
    gallery: /placehold\.co/,
  });

  console.log(`Deleted ${result.deletedCount} seed apartment(s).`);
  await mongoose.connection.close();
  console.log("Disconnected.");
  process.exit(0);
}

deleteSeedApartments().catch((err) => {
  console.error("Delete failed:", err);
  process.exit(1);
});

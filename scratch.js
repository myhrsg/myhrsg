import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  type: String
}, { collection: "events" });

const Event = mongoose.model("Event", eventSchema);

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const events = await Event.find({}, 'title date type').lean();
  console.log(events);
  mongoose.disconnect();
}
test();

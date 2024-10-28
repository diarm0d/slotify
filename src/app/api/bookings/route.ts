import { NextRequest } from "next/server";
import mongoose from "mongoose";
import BookingModel from "@/models/Booking";
import EventTypeModel from "@/models/EventType";

export async function POST(Req: NextRequest) {
  const data = await Req.json();
  const { email, name, additionalInfo, appointment } = data;
  console.log(data);
  await mongoose.connect(process.env.MONGODB_URI || "");
  const eventType = await EventTypeModel.findOne({ uri: data.uri });
  if (!eventType) {
    return Response.json('invalid url', { status: 400 });
  }
  const booking = await BookingModel.create({
    guestEmail: email,
    guestName: name,
    guestNotes: additionalInfo,
    appointment: appointment,
    eventTypeId: eventType?._id,
  });
  return Response.json(true);
}

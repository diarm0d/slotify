import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { session } from "@/lib/session";
import EventTypeModel from "@/models/EventType";

export async function POST(req: NextRequest) {
  await mongoose.connect(process.env.MONGODB_URI || "");
  const data = await req.json();
  const email = await session().get("email");
  if (email) {
    const eventTypeDoc = await EventTypeModel.create({ ...data, email });
    return Response.json(eventTypeDoc);
  }

  return Response.error;
}

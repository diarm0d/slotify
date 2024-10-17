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

export async function PUT(req: NextRequest) {
  await mongoose.connect(process.env.MONGODB_URI || "");
  const data = await req.json();
  const email = await session().get("email");
  const id = data.id;
  if (email && id) {
    const eventTypeDoc = await EventTypeModel.updateOne(
      { email, _id: id },
      data
    );
    return Response.json(eventTypeDoc);
  }

  return Response.error;
}

export async function DELETE(req: NextRequest) {
  await mongoose.connect(process.env.MONGODB_URI || "");
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  await EventTypeModel.deleteOne({ _id: id });
  return Response.json(true);
}

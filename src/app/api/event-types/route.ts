import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { session } from "@/lib/session";
import EventTypeModel from "@/models/EventType";

function uriFromTitle(title: string) {
  return title.toLowerCase().replace(/ /g, "-");
}


export async function POST(req: NextRequest) {
  await mongoose.connect(process.env.MONGODB_URI || "");
  const data = await req.json();
  const email = await session().get("email");
   const uri = uriFromTitle(data.title);
  if (email) {
    const eventTypeDoc = await EventTypeModel.create({ ...data, email, uri });
    return Response.json(eventTypeDoc);
  }

  return Response.error;
}

export async function PUT(req: NextRequest) {
  await mongoose.connect(process.env.MONGODB_URI || "");
  const data = await req.json();
  const email = await session().get("email");
  const uri = uriFromTitle(data.title);

  console.log(uri);
  const id = data.id;
  if (email && id) {
    const eventTypeDoc = await EventTypeModel.updateOne(
      { email, _id: id, uri: uri },
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

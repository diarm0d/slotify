import { NextRequest } from "next/server";
import { session } from "@/lib/session";
import ProfileModel from "@/models/Profile";
import mongoose from "mongoose";


export async function PUT(req: NextRequest) {
  await mongoose.connect(process.env.MONGODB_URI || "");
  const data = await req.json();
  const { username } = data;
  const email = await session().get("email");
  if (email) {
    const profile = await ProfileModel.findOneAndUpdate(
      { email },
      { username },
      { upsert: true, new: true }
    );
  } else {
    await ProfileModel.create({ email, username });
  }
  return Response.json(true);
}

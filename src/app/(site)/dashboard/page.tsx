"use server";
import Dashboard from "@/components/custom/dashboard";
import EventTypeModel from "@/models/EventType";
import mongoose from "mongoose";
import { session } from "@/lib/session";

export default async function DashboardPage() {
  mongoose.connect(process.env.MONGODB_URI || "");
  const email = await session().get("email");
  const eventTypes = await EventTypeModel.find({ email });
  return (
    <>
      {/* {JSON.stringify(eventTypes)} */}
      <Dashboard eventTypes={eventTypes} />
    </>
  );
}

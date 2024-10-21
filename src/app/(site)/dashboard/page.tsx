"use server";
import Dashboard from "@/components/custom/dashboard";
import EventTypeModel from "@/models/EventType";
import mongoose from "mongoose";
import { session } from "@/lib/session";
import { EventType } from "@/components/custom/dashboard";
import { FlattenMaps } from "mongoose";

export default async function DashboardPage() {
  mongoose.connect(process.env.MONGODB_URI || "");
  const email = await session().get("email");
  const fetchedEventTypes = await EventTypeModel.find({ email }).lean();

  const eventTypes = fetchedEventTypes.map(
    (
      event: FlattenMaps<Record<string, unknown>> & Required<{ _id: unknown }>
    ) => ({
      _id: event._id,
      email: event.email || "", 
      title: event.title || "",
      description: event.description || "",
      length: event.length || 0,
      bookingTimes: event.bookingTimes || {},
    })
  ) as EventType[];

  return (
    <>
      <Dashboard eventTypes={eventTypes} />
    </>
  );
}

"use server";
import EventTypeModel from "@/models/EventType";
import ProfileModel from "@/models/Profile";
import mongoose from "mongoose";
import React from "react";
import AppointmentPicker from "@/components/custom/appointmentpicker";
import { EventType } from "@/components/custom/dashboard";
import { FlattenMaps } from "mongoose";


type PageProps = {
  params: {
    username: string;
    'booking-uri': string;
  };
};

const BookingPage = async (props: PageProps) => {
  await mongoose.connect(process.env.MONGODB_URI || "");
  const profile = await ProfileModel.findOne({
    username: props.params.username,
  });
  const fetchedEventType = (await EventTypeModel.findOne({
    uri: props.params?.["booking-uri"],
    email: profile?.email,
  }).lean()) as
    | (FlattenMaps<Record<string, any>> & Required<{ _id: number }>)
    | null;

  const eventType: EventType = {
    //@ts-ignore
    _id: fetchedEventType && fetchedEventType._id,
    email: fetchedEventType?.email || "",
    title: fetchedEventType?.title || "",
    uri: fetchedEventType?.uri || "",
    description: fetchedEventType?.description || "",
    length: fetchedEventType?.length || 0,
    bookingTimes: fetchedEventType?.bookingTimes || {},
  };

  if (!eventType) {
    return "404";
  }
  return (
    <div className="h-screen flex items-center justify-center">
      <AppointmentPicker eventType={eventType} username={profile?.username} />
    </div>
  );
};

export default BookingPage;

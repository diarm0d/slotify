import mongoose, { Schema, model } from "mongoose";

type FromTo = {
  from: string;
  to: string;
};

type BookingTimes = {
  monday: FromTo;
  tuesday: FromTo;
  wednesday: FromTo;
  thursday: FromTo;
  friday: FromTo;
  saturday: FromTo;
  sunday: FromTo;
};

type EventType = {
  email: string;
  title: string;
  description: string;
  length: number;
  bookingTimes: BookingTimes;
  createdAt: Date;
  updatedAt: Date;
};

const FromToSchema = new Schema({
  from: String,
  to: String,
});

const EventTypeSchema = new Schema(
  {
    email: String,
    title: String,
    description: String,
    length: Number,
    bookingTimes: new Schema({
      monday: FromToSchema,
      tuesday: FromToSchema,
      wednesday: FromToSchema,
      thursday: FromToSchema,
      friday: FromToSchema,
      saturday: FromToSchema,
      sunday: FromToSchema,
    }),
  },
  {
    timestamps: true,
  }
);

const EventTypeModel = mongoose.models.EventType || model<EventType>("EventType", EventTypeSchema);

export default EventTypeModel;

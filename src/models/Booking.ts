import mongoose, { model, models, Schema } from "mongoose";

interface Booking extends mongoose.Document {
  guestName: string;
  guestEmail: string;
  guestNotes: string;
  appointment: Date;
  eventTypeId: string;
}

const BookingSchema = new Schema<Booking>({
  guestName: {
    type: String,
    required: true,
  },
  guestEmail: {
    type: String,
    required: true,
  },
  guestNotes: {
    type: String,
    required: false,
  },
  appointment: {
    type: Date,
    required: true,
  },
  eventTypeId: {
    type: String,
    ref: "EventType",
    required: true,
  },
});

export const BookingModel =
  models?.Booking || model<Booking>("Booking", BookingSchema);

export default BookingModel;

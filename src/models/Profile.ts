import mongoose, { Schema, model } from "mongoose";

interface Profile extends mongoose.Document {
  email: string;
  username: string;
}

const ProfileSchema = new Schema<Profile>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

export const ProfileModel =
  mongoose.models.Profile || model<Profile>("Profile", ProfileSchema);

export default ProfileModel;

"use client";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, User } from "lucide-react";
import { EventType } from "@/components/custom/dashboard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface Props {
  eventType: EventType;
  username?: string;
}

const AppointmentPicker: React.FC<Props> = ({ eventType, username }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [bookingTime, setBookingTime] = useState<string | undefined>(undefined);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const uri = eventType.uri;
  const type = eventType.title;


  // Event type information
  // const eventInfo = {
  //   title: "30 Minute Meeting",
  //   description: "A quick catch-up or consultation.",
  //   duration: 30,
  //   username: "johndoe",
  //   avatarUrl: "/placeholder-user.jpg", // Replace with actual avatar URL
  // };

  // Update bookingTime whenever date or time changes
  useEffect(() => {
    if (date && time) {
      const [hour, minute] = time.split(":").map(Number);
      const combinedDate = new Date(date);
      combinedDate.setHours(hour, minute, 0, 0);
      setBookingTime(combinedDate.toISOString());
    } else {
      setBookingTime(undefined); // Clear bookingTime if either date or time is undefined
    }
  }, [date, time]);

  // Generate time slots from 9 AM to 5 PM
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setTime(undefined);
  };

  const handleTimeSelect = (selectedTime: string) => {
    setTime(selectedTime);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await axios.post("/api/bookings", {
      appointment: bookingTime,
      username,
      uri,
      name,
      email,
      additionalInfo,
    });

    console.log("Appointment submitted:", res.data);

    // Reset form after successful submission
    setDate(undefined);
    setTime(undefined);
    setName("");
    setEmail("");
    setAdditionalInfo("");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error submitting appointment:",
        error.response?.status,
        error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
  }
};


  return (
    <Card className="max-w-2xl mx-auto drop-shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage alt={username} />
            <AvatarFallback>
              {username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{eventType.title}</CardTitle>
            <CardDescription className="mt-2">
              {eventType.description}
            </CardDescription>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-2" />
              {eventType.length} minutes
              <User className="w-4 h-4 ml-4 mr-2" />
              {username}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {bookingConfirmed ? (
          <p className="text-sm text-green-600">
            Your appointment has been confirmed!
          </p>
        ) : (
          <>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm font-medium">Select Date</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              className="rounded-md border"
            />
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Select Time</h3>
            {date ? (
              <ScrollArea className="h-[300px] rounded-md border">
                <div className="grid grid-cols-2 gap-2 p-4">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={time === slot ? "default" : "outline"}
                      className="w-full"
                      onClick={() => handleTimeSelect(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">
                Please select a date first
              </p>
            )}
          </div>
        </div>
        {date && time && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <h3 className="text-sm font-medium">Your Selected Appointment</h3>
            <p className="text-sm">
              {eventType.title} with {username}
            </p>
            <p className="text-sm">
              Date: {date.toLocaleDateString()} at {time}
            </p>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Input
                id="additionalInfo"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Any special requests or details"
              />
            </div>
            <Button type="submit" className="w-full">
              Confirm Appointment
            </Button>
          </form>
        )}
        </>
        )}
        {/* // <pre>
        //   {JSON.stringify(
        //     { type, username, uri, bookingTime, name, email, additionalInfo },
        //     null,
        //     2
        //   )}
        // </pre> */}
      </CardContent>
    </Card>
  );
};

export default AppointmentPicker;

"use client";
import { useState } from "react";
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

interface Props {
  eventType: EventType;
  username?: string;
}


const AppointmentPicker: React.FC<Props> = ({ eventType, username}) =>{
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);

  // Event type information
  const eventInfo = {
    title: "30 Minute Meeting",
    description: "A quick catch-up or consultation.",
    duration: 30,
    username: "johndoe",
    avatarUrl: "/placeholder-user.jpg", // Replace with actual avatar URL
  };

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

  return (
    <Card className="max-w-2xl mx-auto drop-shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={eventInfo.avatarUrl} alt={username} />
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
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium">
              Your Selected Appointment
            </h3>
            <p className="text-sm">
              {eventInfo.title} with {eventInfo.username}
            </p>
            <p className="text-sm">
              Date: {date.toLocaleDateString()} at {time}
            </p>
            <Button className="mt-4 w-full">Confirm Appointment</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AppointmentPicker;
"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";
import EventTypeForm from "./eventtypeform";
import { FormattedDays } from "./eventtypeform";

// Mock data for booked events
const bookedEvents = [
  {
    id: 1,
    title: "Team Meeting",
    date: "2023-06-15",
    time: "10:00 AM",
    attendees: 5,
  },
  {
    id: 2,
    title: "Client Presentation",
    date: "2023-06-16",
    time: "2:00 PM",
    attendees: 3,
  },
  {
    id: 3,
    title: "Project Kickoff",
    date: "2023-06-17",
    time: "9:00 AM",
    attendees: 8,
  },
];

export interface EventType {
  _id: number;
  email: string;
  title: string;
  description: string;
  length: number;
  bookingTimes: FormattedDays;
  createdAt?: Date; // Timestamps fields if needed
  updatedAt?: Date;
}

interface Props {
  eventTypes: EventType[];
}

const Dashboard: React.FC<Props> = ({ eventTypes }) => {
  const [activeTab, setActiveTab] = useState("booked");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="booked">Booked Events</TabsTrigger>
          <TabsTrigger value="types">Event Types</TabsTrigger>
        </TabsList>
        <TabsContent value="booked">
          <Card>
            <CardHeader>
              <CardTitle>Booked Events</CardTitle>
              <CardDescription>Your upcoming scheduled events</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {bookedEvents.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.date} at {event.time}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.attendees} attendees
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <SettingsIcon className="h-4 w-4" />
                      <span className="sr-only">Settings</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>Event Types</CardTitle>
              <CardDescription>
                Manage your available event types
              </CardDescription>
            </CardHeader>
            <CardContent>
              {eventTypes.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="block">
                    <div>
                      {" "}
                      Currently no event types available. Please create a new
                      event type.
                    </div>
                    <div className="flex items-center">
                      <EventTypeForm />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <ul className="space-y-4">
                    {eventTypes.map((type, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold">{type.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {type.length} minutes
                          </p>
                        </div>
                        <EventTypeForm
                          eventType={type}
                          buttonIcon="settings"
                          buttonType="ghost"
                          buttonSize="icon"
                        />
                      </li>
                    ))}
                  </ul>
                  <EventTypeForm />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;

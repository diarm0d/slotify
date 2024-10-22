"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsIcon } from "lucide-react";
import EventTypeForm from "./eventtypeform";
import { FormattedDays } from "./eventtypeform";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import UrlCopier from "./urlcopier";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";

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
  uri: string;
  description: string;
  length: number;
  bookingTimes: FormattedDays;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Props {
  eventTypes: EventType[];
  username?: string;
}

// Custom hook for form submission state management
const useFormState = (submitFn: (formData: FormData) => Promise<void>) => {
  const [formState, setFormState] = useState<{
    status: "idle" | "submitting" | "success" | "error";
    message?: string;
  }>({
    status: "idle",
  });

  const formAction = async (formData: FormData) => {
    try {
      setFormState({ status: "submitting" });
      await submitFn(formData);
      setFormState({
        status: "success",
        message: "Form submitted successfully!",
      });
    } catch (error) {
      setFormState({
        status: "error",
        message: "Error submitting form. Please try again.",
      });
      console.error("Form submission error:", error);
    }
  };

  return [formState, formAction] as const;
};

const submitUsername = async (FormData: FormData) => {
  await axios.put("api/profile", { username: FormData.get("username") });
};

const Dashboard: React.FC<Props> = ({ eventTypes, username }) => {
  const [activeTab, setActiveTab] = useState("booked");
  const [state, formAction] = useFormState(submitUsername);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    await formAction(formData);
    setIsSubmitting(false);
  };

  if (!router) {
    return <Skeleton className="w-[100px] h-[20px] rounded-full" />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="booked">Booked Events</TabsTrigger>
          <TabsTrigger value="types">Event Types</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
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
                      <EventTypeForm username={username} />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <ul className="space-y-4 mb-4">
                    {eventTypes.map((type, i) => {
                      const url = `${process.env.NEX_PUBLIC_URL}/${username}/${type.uri}`;
                      return (
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
                          <div className="flex items-center">
                            <UrlCopier url={url} iconOnly />
                            <EventTypeForm
                              eventType={type}
                              buttonIcon="settings"
                              buttonType="ghost"
                              buttonSize="icon"
                              username={username}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <EventTypeForm router={router} username={username} />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="max-w-md">
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Update your profile information here.
                    </CardDescription>
                  </CardHeader>
                  <form action={handleSubmit}>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            required
                            minLength={3}
                            value={username || ""}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Profile"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>

                {state.status !== "idle" && (
                  <Alert
                    className="mt-4 max-w-md mx-auto"
                    variant={
                      state.status === "error" ? "destructive" : "default"
                    }
                  >
                    {state.status === "error" ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    <AlertTitle>
                      {state.status === "error" ? "Error" : "Success"}
                    </AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;

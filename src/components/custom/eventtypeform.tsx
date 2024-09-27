import React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, Field } from "react-final-form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const onSubmit = () => {
  console.log("Form submitted");
};


const EventTypeForm = () => {
  return (
    <Drawer>
      <DrawerTrigger>
        {" "}
        <Button className="mt-4">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Event Type
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create new event type</DrawerTitle>
          <DrawerDescription>
            This is a type of event that you can schedule in your calendar.
          </DrawerDescription>
        </DrawerHeader>
        <Form
          className="w-full"
          onSubmit={onSubmit}
          initialValues={{}}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit}>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length">Length (in minutes)</Label>
                  <Input id="length" type="number" placeholder="Enter length" />
                </div>
              </div>
              <div className="p-4 space-y-2">
                <Label>Daily Schedule</Label>
                {days.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <span className="w-24">{day}</span>
                    <Select>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="From" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(24)].map((_, i) => (
                          <SelectItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="To" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(24)].map((_, i) => (
                          <SelectItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                          >
                            {i.toString().padStart(2, "0")}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <DrawerFooter>
                <Button type="submit" disabled={submitting || pristine}>
                  Submit
                </Button>
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
              <pre>{JSON.stringify(values)}</pre>
            </form>
          )}
        />
      </DrawerContent>
    </Drawer>
  );
}

export default EventTypeForm
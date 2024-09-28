import React from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon } from "lucide-react";
import axios, { isCancel, AxiosError } from "axios";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const SelectAdapter = ({ input, ...rest }: any) => {
  return (
    <Select
      onValueChange={input ? (value) => input.onChange(value) : undefined}
    >
      <SelectTrigger>
        <SelectValue placeholder={rest.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {rest.options.map((option: any) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const EventTypeForm = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [activeDays, setActiveDays] = React.useState<Record<string, boolean>>(
    Object.fromEntries(days.map((day) => [day, false]))
  );

  const handleDayToggle = (day: string) => {
    setActiveDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const onSubmit = (values: any) => {
    console.log(values);
    const { title, description, length } = values;

    const formattedDays = days.reduce(
      (acc, day) => ({
        ...acc,
        [day]: {
          active: values[`${day}-active`],
          from: values[`${day}-from`] || null,
          to: values[`${day}-to`] || null,
        },
      }),
      {}
    );

    console.log("Form submitted", {
      title,
      description,
      length,
      days: formattedDays,
    });

    axios.post("/api/event-types", {
      title,
      description,
      length,
      days: formattedDays,
    });

    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger>
        {" "}
        <Button className="mt-4" onClick={() => setIsOpen(true)}>
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
          initialValues={{ bookingTimes: {} }}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit}>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Field name="title" type="text">
                    {({ input, meta }) => (
                      <Input id="title" placeholder="Enter title" {...input} />
                    )}
                  </Field>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Field name="description">
                    {({ input, meta }) => (
                      <Textarea
                        id="description"
                        placeholder="Enter description"
                        {...input}
                      />
                    )}
                  </Field>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length">Length (in minutes)</Label>
                  <Field name="length" type="number">
                    {({ input, meta }) => (
                      <Input
                        id="length"
                        type="number"
                        placeholder="Enter length"
                        {...input}
                      />
                    )}
                  </Field>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <Label>Daily Schedule</Label>
                {days.map((day) => (
                  <div
                    key={day}
                    className="flex items-center justify-between space-x-2"
                  >
                    <div>
                      <Field name={`${day}-active`} type="checkbox">
                        {({ input }) => (
                          <Checkbox
                            id={`checkbox-${day}`}
                            checked={input.value}
                            onCheckedChange={input.onChange}
                          />
                        )}
                      </Field>
                      <Label htmlFor={`checkbox-${day}`} className="w-24 pl-4">
                        {day}
                      </Label>
                    </div>
                    <div className="w-[150px]">
                      <Field
                        disabled={!activeDays[day]}
                        name={`${day}-from`}
                        type="select"
                        component={SelectAdapter}
                        placeholder="From"
                        options={[...Array(24)].map((_, i) => ({
                          value: i.toString().padStart(2, "0"),
                          label: `${i.toString().padStart(2, "0")}:00`,
                        }))}
                      />
                    </div>
                    <div className="w-[150px]">
                      <Field
                        disabled={!activeDays[day]}
                        name={`${day}-to`}
                        type="select"
                        component={SelectAdapter}
                        placeholder="To"
                        options={[...Array(24)].map((_, i) => ({
                          value: i.toString().padStart(2, "0"),
                          label: `${i.toString().padStart(2, "0")}:00`,
                        }))}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <DrawerFooter>
                <Button
                  type="submit"
                  disabled={submitting || pristine}
                >
                  Submit
                </Button>
                <DrawerClose>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
              <pre>{JSON.stringify(values)}</pre>
            </form>
          )}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default EventTypeForm;

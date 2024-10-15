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
import axios from "axios";
import { FieldRenderProps } from "react-final-form";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface DaySchedule {
  active: boolean;
  from: number | null;
  to: number | null;
}

export type FormattedDays = {
  [day: string]: DaySchedule;
};

type WeekSchedule = {
  mondayActive: boolean;
  mondayFrom: number | null;
  mondayTo: number | null;

  tuesdayActive: boolean;
  tuesdayFrom: number | null;
  tuesdayTo: number | null;

  wednesdayActive: boolean;
  wednesdayFrom: number | null;
  wednesdayTo: number | null;

  thursdayActive: boolean;
  thursdayFrom: number | null;
  thursdayTo: number | null;

  fridayActive: boolean;
  fridayFrom: number | null;
  fridayTo: number | null;

  saturdayActive: boolean;
  saturdayFrom: number | null;
  saturdayTo: number | null;

  sundayActive: boolean;
  sundayFrom: number | null;
  sundayTo: number | null;
};

type Option = {
  value: string;
  label: string;
};

interface FormInputs {
  title: string;
  description: string;
  length: number;
  bookingTimes: Record<string, string>;
  [key: string]: boolean | string | number | Record<string, string>;
}

type FormValues = FormInputs & WeekSchedule;

const SelectAdapter = ({
  input,
  ...rest
}: FieldRenderProps<string, HTMLElement>) => {
  return (
    <Select
      onValueChange={input ? (value) => input.onChange(value) : undefined}
      disabled={rest.disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={rest.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {rest.options.map((option: Option) => (
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

  const onSubmit = (values: FormValues) => {
    const { title, description, length } = values;

    const formattedDays: FormattedDays = days.reduce(
      (acc, day) => ({
        ...acc,
        [day]: {
          active: values[`${day}Active` as keyof FormValues] as boolean,
          from: values[`${day}From` as keyof FormValues] || null,
          to: values[`${day}To` as keyof FormValues] || null,
        },
      }),
      {}
    );

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
        <Form<FormValues>
          className="w-full"
          onSubmit={onSubmit}
          initialValues={{ bookingTimes: {} }}
          render={({ handleSubmit, submitting, pristine, values, form }) => (
            <form onSubmit={handleSubmit}>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Field name="title" type="text">
                    {({ input }) => (
                      <Input id="title" placeholder="Enter title" {...input} />
                    )}
                  </Field>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Field name="description">
                    {({ input }) => (
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
                    {({ input }) => (
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
                {days.map((day) => {
                  const activeDay: string = `${day}Active`;
                  return (
                    <div
                      key={day}
                      className="flex items-center justify-between space-x-2"
                    >
                      <div className="w-[150px]">
                        <Field name={`${day}Active`} type="checkbox">
                          {({ input }) => {
                            return (
                              <Checkbox
                                id={`checkbox-${day}`}
                                checked={input.value}
                                onCheckedChange={input.onChange}
                              />
                            );
                          }}
                        </Field>
                        <Label
                          htmlFor={`checkbox-${day}`}
                          className="w-24 pl-4"
                        >
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </Label>
                      </div>
                      <div className="w-[150px]">
                        <Field
                          disabled={
                            !form.getState().values[activeDay] as boolean
                          }
                          name={`${day}From`}
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
                          disabled={
                            !form.getState().values[activeDay] as boolean
                          }
                          name={`${day}To`}
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
                  );
                })}
              </div>
              <DrawerFooter>
                <Button type="submit" disabled={submitting || pristine}>
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

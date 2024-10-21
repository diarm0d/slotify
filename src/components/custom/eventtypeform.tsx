"use client";
import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, Field } from "react-final-form";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon, SettingsIcon, Trash2Icon } from "lucide-react";
import axios from "axios";
import { FieldRenderProps } from "react-final-form";
import { EventType } from "@/components/custom/dashboard";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import UrlCopier from "./urlcopier";

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

interface Props {
  eventType?: EventType;
  buttonType?: "ghost" | "outline";
  buttonIcon?: "plus" | "settings";
  buttonSize?: "icon";
  router?: AppRouterInstance;
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
      value={input?.value || ""}
    >
      <SelectTrigger>
        <SelectValue placeholder={rest.placeholder}>
          {input?.value || rest.placeholder}
        </SelectValue>
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

const EventTypeForm = ({
  eventType,
  buttonType,
  buttonIcon,
  buttonSize,
  router,
}: Props) => {
  console.log(eventType);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const initialValues = { bookingTimes: {} };
  const editValues = eventType && {
    title: eventType.title || "",
    description: eventType.description || "",
    length:
      typeof eventType.length === "number"
        ? eventType.length
        : parseInt(eventType.length, 10) || undefined,
    ...(eventType.bookingTimes
      ? Object.keys(eventType.bookingTimes).reduce(
          (acc, day) => ({
            ...acc,
            [`${day}Active`]:
              eventType.bookingTimes[day].active ||
              (eventType.bookingTimes[day].from !== null &&
                eventType.bookingTimes[day].to !== null)
                ? true
                : false,
            [`${day}From`]:
              eventType.bookingTimes[day].from !== null
                ? eventType.bookingTimes[day].from?.toString().padStart(2, "0")
                : null,
            [`${day}To`]:
              eventType.bookingTimes[day].to !== null
                ? eventType.bookingTimes[day].to?.toString().padStart(2, "0")
                : null,
          }),
          {}
        )
      : {}),
  };

  const handleDelete = async (id: number) => {
    await axios.delete("api/event-types?id=" + id);
  };

  const onSubmit = async (values: FormValues) => {
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

    const id = eventType?._id;
    const request = id ? axios.put : axios.post;
    const data = {
      title,
      description,
      length,
      bookingTimes: formattedDays,
    };

    const response = await request("/api/event-types", { ...data, id });

    if (response.data) {
      setIsOpen(false);
      router?.push("/dashboard");
      router?.refresh();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger>
        {" "}
        <Button
          variant={buttonType}
          size={buttonSize}
          onClick={() => setIsOpen(true)}
        >
          {buttonIcon && buttonIcon === "settings" ? (
            <SettingsIcon className="h-4 w-4" />
          ) : (
            <>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add New Event Type
            </>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-3/4 overflow-auto">
        <ScrollArea className="overflow-auto">
          <DrawerHeader>
            <DrawerTitle>{eventType ? `Edit ${eventType.title}` : "New Event"}</DrawerTitle>
            {eventType ? (
              <UrlCopier url={`https://example.com/${eventType.uri}`} />
            ) : (
              <DrawerDescription>
                This is a type of event that you can schedule in your calendar.
              </DrawerDescription>
            )}
          </DrawerHeader>
          <Form<FormValues>
            className="w-full"
            onSubmit={onSubmit}
            initialValues={eventType ? editValues : initialValues}
            render={({ handleSubmit, submitting, pristine, form }) => (
              <form onSubmit={handleSubmit}>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Field name="title" type="text">
                      {({ input }) => (
                        <Input
                          id="title"
                          placeholder="Enter title"
                          {...input}
                        />
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
                                  checked={!!input.checked}
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
                            disabled={!form.getState().values[`${day}Active`]}
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
                            disabled={!form.getState().values[`${day}Active`]}
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
                  {eventType && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2Icon className="mr-2 h-4 w-4" />
                          Delete Event
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this event?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the event and remove all associated data from
                            our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => {
                              handleDelete(eventType?._id);
                              setIsOpen(false);
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                </DrawerFooter>
              </form>
            )}
          />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default EventTypeForm;

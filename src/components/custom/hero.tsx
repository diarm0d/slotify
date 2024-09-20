'use client';
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users } from "lucide-react";
import Image from "next/image";

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-[#698474]">
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center d-flex flex-column align-items-center">
        <div>{icon}</div>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}


const Hero = () => {
  return (
    <>
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">
          Scheduling made chill for people like you
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Slotify helps you schedule meetings without the back-and-forth emails
        </p>
        <Button size="lg" className="bg-[#DCA47C]">
          Get Started
        </Button>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Trusted by Industry Leaders
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          <Image
            src="/placeholder.svg?height=60&width=120"
            width={120}
            height={60}
            alt="Company logo"
            className="opacity-50 hover:opacity-100 transition-opacity"
          />
          <Image
            src="/placeholder.svg?height=60&width=120"
            width={120}
            height={60}
            alt="Company logo"
            className="opacity-50 hover:opacity-100 transition-opacity"
          />
          <Image
            src="/placeholder.svg?height=60&width=120"
            width={120}
            height={60}
            alt="Company logo"
            className="opacity-50 hover:opacity-100 transition-opacity"
          />
          <Image
            src="/placeholder.svg?height=60&width=120"
            width={120}
            height={60}
            alt="Company logo"
            className="opacity-50 hover:opacity-100 transition-opacity"
          />
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <FeatureCard
          icon={<Calendar className="h-8 w-8 mb-4 text-primary" />}
          title="Easy Scheduling"
          description="Share your Slotify link and let others book their preferred time slot"
        />
        <FeatureCard
          icon={<Clock className="h-8 w-8 mb-4 text-primary" />}
          title="Time Zone Intelligence"
          description="Automatically detects and adjusts to your invitee's time zone"
        />
        <FeatureCard
          icon={<Users className="h-8 w-8 mb-4 text-primary" />}
          title="Team Scheduling"
          description="Coordinate meetings across multiple team members' calendars"
        />
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to simplify your scheduling?
        </h2>
        <Button size="lg" className="bg-[#DCA47C]">
          Sign Up for Free
        </Button>
      </section>
    </>
  );
};

export default Hero;

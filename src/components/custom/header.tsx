"use server";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { session } from "@/lib/session";
import Link from "next/link";

const Header = async () => {
  const email = await session().get("email");
  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <div className="flex">
        <h1 className="text-4xl font-bold text-primary mr-4">Slotify</h1>
        <Image src="/sloth.png" width={60} height={60} alt="Company logo" />
      </div>
      <div>
        {email ? (
          <div>
            <Button className="bg-[#DCA47C]">Dashboard</Button>
            <Button variant="outline" className="ml-2 border-[#698474]">
              <Link href="/api/logout">Logout</Link>
            </Button>
          </div>
        ) : (
          <div>
            <Button className="bg-[#DCA47C]">
              <Link href="/api/auth">Sign Up</Link>
            </Button>
            <Button variant="outline" className="ml-2 border-[#698474]">
              <Link href="/api/auth">Login</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

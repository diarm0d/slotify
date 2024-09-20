import { session } from "@/lib/session";
import { redirect } from "next/navigation";


export async function GET() {
  await session().setAll({});
  await session().destroy();
  redirect("/?logged_out=true");
}

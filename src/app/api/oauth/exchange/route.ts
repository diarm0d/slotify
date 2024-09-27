import { nylas, nylasConfig } from "@/lib/nylas";
import { session } from "@/lib/session";
import { NextApiRequest } from "next";
import { redirect } from "next/navigation";

export async function GET(req: NextApiRequest) {
  const url = new URL(req.url || "");
  const code = url.searchParams.get("code");

  if (!code) {
    return Response.json(
      { message: "No authorization code returned from Nylas" },
      { status: 400 }
    );
  }

  const codeExchangePayload = {
    clientSecret: nylasConfig.apiKey,
    clientId: nylasConfig.clientId as string,
    redirectUri: nylasConfig.callbackUri,
    code,
  };

  try {
    const response = await nylas.auth.exchangeCodeForToken(codeExchangePayload);
    const { grantId, email } = response;

    console.log(response);

    await session().set("grantId", grantId);
    await session().set("email", email);

    redirect("/");
  } catch (error) {
    return Response.json(
      { message: "Failed to exchange authorization code for token" },
      { status: 500 }
    );
  }
}

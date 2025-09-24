// app/api/token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room") || "default";
  const name = req.nextUrl.searchParams.get("username") || "guest";

  const at = new AccessToken(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, {
    identity: name,
  });
  at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

  return NextResponse.json({ token: await at.toJwt() });
}

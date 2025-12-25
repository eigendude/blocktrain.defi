/*
 * Copyright (C) 2025-2026 blocktrain.fi
 * https://github.com/blocktrain/blocktrain-dapp
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 * See the file LICENSE.txt for more information.
 */

import { createClient, Errors } from "@farcaster/quick-auth";
import { NextRequest, NextResponse } from "next/server";

const client: ReturnType<typeof createClient> = createClient();

export async function GET(
  request: NextRequest,
): Promise<NextResponse<{ message: string } | { userFid: string }>> {
  // Because we're fetching this endpoint via `sdk.quickAuth.fetch`,
  // if we're in a mini app, the request will include the necessary `Authorization` header.
  const authorization: string | null = request.headers.get("Authorization");

  // Here we ensure that we have a valid token.
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing token" }, { status: 401 });
  }

  try {
    // Now we verify the token. `domain` must match the domain of the request.
    // In our case, we're using the `getUrlHost` function to get the domain of the request
    // based on the Vercel environment. This will vary depending on your hosting provider.
    const token: string = authorization.split(" ")[1];
    const payload = await client.verifyJwt({
      token,
      domain: getUrlHost(request),
    });

    // If the token was valid, `payload.sub` will be the user's Farcaster ID.
    // This is guaranteed to be the user that signed the message in the mini app.
    // You can now use this to do anything you want, e.g. fetch the user's data from your database
    // or fetch the user's info from a service like Neynar.
    const userFid: string = String(payload.sub);

    // By default, we'll return the user's FID. Update this to meet your needs.
    return NextResponse.json({ userFid });
  } catch (e: unknown) {
    if (e instanceof Errors.InvalidTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (e instanceof Error) {
      return NextResponse.json({ message: e.message }, { status: 500 });
    }

    throw e;
  }
}

function getUrlHost(request: NextRequest): string {
  // First try to get the origin from the Origin header
  const origin: string | null = request.headers.get("origin");
  if (origin) {
    try {
      const url: URL = new URL(origin);
      return url.host;
    } catch (error: unknown) {
      console.warn("Invalid origin header:", origin, error);
    }
  }

  // Fallback to Host header
  const host: string | null = request.headers.get("host");
  if (host) {
    return host;
  }

  // Final fallback to environment variables
  let urlValue: string;
  if (process.env.VERCEL_ENV === "production") {
    urlValue = process.env.NEXT_PUBLIC_URL!;
  } else if (process.env.VERCEL_URL) {
    urlValue = `https://${process.env.VERCEL_URL}`;
  } else {
    urlValue = "http://localhost:3000";
  }

  const urlFromEnv: URL = new URL(urlValue);
  return urlFromEnv.host;
}

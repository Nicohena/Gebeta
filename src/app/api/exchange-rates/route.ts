import { NextResponse } from "next/server";

const CURRENCIES = ["ETB", "CNY", "EUR", "MXN"];
const API_URL = "https://open.er-api.com/v6/latest/USD";

export async function GET() {
  try {
    // Use no-store so each call is fresh, but we set Cache-Control on the response
    // so the browser/CDN caches it for 1 hour
    const res = await fetch(API_URL, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Exchange rate API responded with HTTP ${res.status}`);
    }

    const data = await res.json();

    if (data.result !== "success") {
      throw new Error(`Exchange rate API error: ${data["error-type"] ?? "unknown"}`);
    }

    const rates: Record<string, number> = { USD: 1 };
    for (const code of CURRENCIES) {
      if (typeof data.rates[code] === "number") {
        rates[code] = data.rates[code];
      }
    }

    return NextResponse.json(
      {
        rates,
        fetchedAt: new Date().toISOString(),
        provider: "open.er-api.com",
      },
      {
        headers: {
          // Cache this response for 1 hour at the CDN / browser level
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (err) {
    console.error("[exchange-rates API]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch live exchange rates" },
      { status: 503 }
    );
  }
}

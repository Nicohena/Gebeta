import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// We use the anon key here, but it works because the RLS policies in this project 
// allow authenticated users to update rates. In a real production setup with a standard 
// anon key, you would want to use a Supabase Service Role Key instead to bypass RLS.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const CURRENCIES = ["ETB", "CNY", "EUR", "MXN"];
const API_URL = "https://open.er-api.com/v6/latest/USD";

// This endpoint can be called by Vercel Cron, GitHub Actions, or cron-job.org
export async function GET(request: Request) {
  try {
    // Basic protection: if a CRON_SECRET is set in .env, require it in the Authorization header
    const authHeader = request.headers.get("Authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch live rates
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

    // Fetch current rates from Supabase
    const { data: currentData, error: fetchError } = await supabase
      .from("exchange_rates")
      .select("*")
      .eq("id", 1)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") { // Ignore "no rows returned"
      throw fetchError;
    }

    const THRESHOLD = 0.0001; // 0.01% change required to save
    let hasChanged = false;

    if (!currentData) {
      hasChanged = true;
    } else {
      hasChanged = CURRENCIES.some((code) => {
        const live = rates[code] ?? 0;
        const saved = currentData[code.toLowerCase()] ?? 0;
        return saved === 0 || Math.abs(live - saved) / saved > THRESHOLD;
      });
    }

    if (hasChanged) {
      // 1. Update the rates table
      const updateData = {
        usd: rates.USD,
        etb: rates.ETB,
        cny: rates.CNY,
        eur: rates.EUR,
        mxn: rates.MXN,
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = currentData 
        ? await supabase.from("exchange_rates").update(updateData).eq("id", 1)
        : await supabase.from("exchange_rates").insert([{ id: 1, ...updateData }]);

      if (updateError) throw updateError;
      
      // 2. Log to rate_history
      const { error: historyError } = await supabase.from("rate_history").insert({
        timestamp: new Date().toISOString(),
        changed_by: "System Cron (Auto-sync)",
        changes: rates,
      });

      if (historyError) {
        console.error("Failed to log rate history:", historyError);
        // We don't throw here because the rates themselves were updated successfully
      }

      return NextResponse.json({ 
        success: true, 
        updated: true, 
        message: "Rates updated successfully",
        rates 
      });
    }

    return NextResponse.json({ 
      success: true, 
      updated: false, 
      message: "Rates were already up to date",
      rates 
    });

  } catch (err) {
    console.error("[cron/sync-rates]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to sync exchange rates" },
      { status: 500 }
    );
  }
}

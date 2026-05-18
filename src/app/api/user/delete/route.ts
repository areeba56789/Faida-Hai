import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";

export async function DELETE() {
  try {
    // 1. Authenticate the requesting user via their session cookie
    const supabaseSession = await createServerClient();
    const { data: { user }, error: authError } = await supabaseSession.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Use the Service Role key to perform admin-level deletions
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL for admin deletion.");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 3. Delete user data first (RLS cascade should handle user_portfolios,
    //    but we explicitly delete property_analysis as well)
    await supabaseAdmin.from("property_analysis").delete().eq("user_id", user.id);
    await supabaseAdmin.from("user_portfolios").delete().eq("user_id", user.id);

    // 4. Delete the auth user record permanently
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error("Failed to delete auth user:", deleteError);
      return NextResponse.json({ error: "Failed to delete user account." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Account permanently deleted." });
  } catch (error: any) {
    console.error("Account deletion error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

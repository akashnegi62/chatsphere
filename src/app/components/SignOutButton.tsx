"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const supabase = createClient();
  const router = useRouter();

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      router.push("/auth");
      window.location.reload();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  }

  return (
    <div
      className="flex items-center text-sm gap-2 cursor-pointer bg-[#313130] hover:bg-[#404040] p-2 rounded-md"
      onClick={handleSignOut}
    >
      <LogOut className="w-5 h-5 shrink-0" />
      <span className="ml-2 text-sm">Logout</span>
    </div>
  );
}

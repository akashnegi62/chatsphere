"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // user is logged in → redirect to "/"
        router.replace("/");
      } else {
        // no session → redirect back to login
        router.replace("/auth");
      }
    };

    handleAuth();
  }, [router]);

  return <div className=""></div>;
}

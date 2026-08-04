"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasPassword = useMemo(
    () => form.password.trim().length > 0,
    [form.password]
  );
  const hasConfirmPassword = useMemo(
    () => form.confirmPassword.trim().length > 0,
    [form.confirmPassword]
  );

  // Real-time validation
  const passwordTooShort = form.password.length > 0 && form.password.length < 6;
  const passwordsDontMatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordTooShort) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (passwordsDontMatch) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: form.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password updated successfully. Please log in.");
      router.push("/auth");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex justify-center items-center bg-white">
      <div className="mx-auto grid w-full lg:min-w-1/2 max-w-6xl lg:max-w-md grid-cols-1 px-8 lg:px-4 py-10 md:grid-cols-2 md:py-16 lg:py-20 ">
        {/* Left: Form */}
        <section className="flex items-center lg:bg-gray-100 lg:px-8">
          <div className="w-full">
            <h1 className="text-3xl lg:text-4xl text-center font-semibold tracking-tight text-neutral-900">
              Reset Password!
            </h1>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {/* New Password */}
              <div>
                <label className="mb-2 block text-sm lg:text-md text-neutral-700">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full rounded-md border border-neutral-200 bg-white px-10 py-3 pr-12 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-300"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => hasPassword && setShowPassword((s) => !s)}
                    className={[
                      "absolute right-3 top-1/2 -translate-y-1/2 transition",
                      hasPassword
                        ? "opacity-100 scale-100 text-neutral-500 hover:text-neutral-700"
                        : "opacity-0 scale-90 pointer-events-none",
                    ].join(" ")}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {passwordTooShort && (
                  <p className="mt-1 text-xs text-red-600">
                    Password must be at least 6 characters
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm lg:text-md text-neutral-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full rounded-md border border-neutral-200 bg-white px-10 py-3 pr-12 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-300"
                  />
                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    onClick={() =>
                      hasConfirmPassword && setShowConfirmPassword((s) => !s)
                    }
                    className={[
                      "absolute right-3 top-1/2 -translate-y-1/2 transition",
                      hasConfirmPassword
                        ? "opacity-100 scale-100 text-neutral-500 hover:text-neutral-700"
                        : "opacity-0 scale-90 pointer-events-none",
                    ].join(" ")}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {passwordsDontMatch && (
                  <p className="mt-1 text-xs text-red-600">
                    Passwords do not match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-[#123b65] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#154575] active:translate-y-px disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Update"
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Right: Visual */}
        <section className="h-[50vh] w-full hidden lg:block relative">
          <Image fill src="/signup.png" alt="" />
        </section>
      </div>
    </main>
  );
}

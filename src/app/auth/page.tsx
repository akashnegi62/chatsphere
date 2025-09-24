"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { RxGithubLogo } from "react-icons/rx";
import { supabase } from "@/app/lib/supabaseClient";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const hasPassword = useMemo(
    () => form.password.trim().length > 0,
    [form.password]
  );

  // Email login
  const signInWithEmail = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) throw error;
    return data;
  };

  // Email signup
  const signUpWithEmail = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  };

  // OAuth
  const signInWithProvider = async (provider: "google" | "github") => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  };

  // Submit handler
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmail();
        toast.success("Signed in successfully!");
        router.push("/");
      } else {
        await signUpWithEmail();
        toast.success("Check your email inbox to confirm your account.");

        setForm({ name: "", email: "", password: "" });
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email || !form.email.includes("@")) {
      toast.error("Please enter a valid email first.");
      return;
    }

    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset email sent! Check your inbox.");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex justify-center items-center bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 px-8 lg:px-4 py-10 md:grid-cols-2 md:py-16 lg:py-20">
        {/* Left: Form */}
        <section className="flex items-center lg:bg-gray-100 lg:px-8 lg:py-12">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl lg:text-4xl text-center font-semibold tracking-tight text-neutral-900">
              {mode === "login" ? "Welcome back!" : "Create your account"}
            </h1>

            {/* Google */}
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await signInWithProvider("google");
                } catch (e) {
                  toast.error((e as Error).message);
                } finally {
                  setLoading(false);
                }
              }}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 active:translate-y-px cursor-pointer"
            >
              <FcGoogle className="h-5 w-5" />
              Continue with Google
            </button>

            {/* GitHub */}
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await signInWithProvider("github");
                } catch (e) {
                  toast.error((e as Error).message);
                } finally {
                  setLoading(false);
                }
              }}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 active:translate-y-px cursor-pointer"
            >
              <RxGithubLogo className="h-5 w-5" />
              Continue with Github
            </button>

            {/* Divider */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px w-full bg-neutral-200" />
              <span className="text-xs text-neutral-500 whitespace-nowrap">
                or {mode === "login" ? "Sign in" : "Sign up"} with Email
              </span>
              <div className="h-px w-full bg-neutral-200" />
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="mb-2 block text-sm lg:text-md text-neutral-700">
                    Name
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="w-full rounded-md border border-neutral-200 bg-white px-10 py-3 text-sm text-neutral-900 outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-300"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm lg:text-md text-neutral-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="jane@example.com"
                    className="w-full rounded-md border border-neutral-200 bg-white px-10 py-3 text-sm text-neutral-900 outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-300"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm lg:text-md text-neutral-700">
                  Password
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
                    className="w-full rounded-md border border-neutral-200 bg-white px-10 py-3 pr-12 text-sm text-neutral-900 outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-300"
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-[#123b65] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#154575] active:translate-y-px"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : mode === "login" ? (
                  "Sign in"
                ) : (
                  "Register Now"
                )}
              </button>
            </form>

            {/* Switch Mode */}
            <p className="mt-4 text-center text-sm text-neutral-600">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-[#123b65] underline cursor-pointer"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-[#123b65] underline cursor-pointer"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>

            {/* Reset Password link */}
            {mode === "login" && (
              <div className="mt-2 text-center">
                <button
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="flex items-center justify-center gap-2 mx-auto text-[#123b65] text-sm underline cursor-pointer disabled:opacity-50"
                >
                  {resetLoading ? "Forgot password?" : "Forgot password?"}
                  {resetLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Right: Visual */}
        <section className="h-full w-full hidden lg:block relative">
          {mode === "login" ? (
            <Image fill src="/signin.png" alt="" />
          ) : (
            <Image fill src="/signup.png" alt="" />
          )}
        </section>
      </div>
    </main>
  );
}

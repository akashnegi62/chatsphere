"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  UserRoundCheck,
  CircleUserRound,
} from "lucide-react";
import { SignOutButton } from "./SignOutButton";

interface UserMenuProps {
  user?: { email: string; name?: string };
  sidebarOpen: boolean;
}
export default function UserMenu({ user, sidebarOpen }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !(menuRef.current as HTMLElement).contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <div
        className="flex gap-1 items-center cursor-pointer px-2 py-2 hover:bg-[#313130] rounded-md"
        onClick={() => setOpen((prev) => !prev)}
      >
        <UserIcon className="w-6 h-6 shrink-0" />

        {sidebarOpen && (
          <span className="flex items-center gap-2 ml-2 text-md lg:text-sm">
            {user?.name ?? "Guest"}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-12 left-0 mt-2 w-52 bg-[#202120] border border-[#313130] rounded-lg shadow-lg px-2 py-2 z-50">
          {user ? (
            <>
              <p className="flex gap-2 text-sm text-gray-300 mb-3 cursor-pointer bg-[#313130] hover:bg-[#404040] p-2 rounded-md">
                <CircleUserRound />{" "}
                <span className="truncate">{user.email}</span>
              </p>

              <SignOutButton />
            </>
          ) : (
            <button
              onClick={() => router.push("/auth")}
              className="w-full flex items-center gap-4 text-sm cursor-pointer bg-[#313130] hover:bg-[#404040] p-2 rounded-md"
            >
              <UserRoundCheck />
              Sign In
            </button>
          )}
        </div>
      )}
    </div>
  );
}

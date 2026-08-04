"use client";
import { useState, useEffect, useRef } from "react";
import {
  Plus,
  PanelRight,
  Pencil,
  Trash,
  MessageCircleDashed,
  Ellipsis,
  Menu,
  X,
} from "lucide-react";
import UserMenu from "./UserMenu";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
interface Message {
  role: "user" | "assistant";
  content: string;
  fileUrl?: string;
  fileName?: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

interface SidebarProps {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  selectedChatId: string | null;
  setSelectedChatId: React.Dispatch<React.SetStateAction<string | null>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
  chats,
  setChats,
  selectedChatId,
  setSelectedChatId,
  setMessages,
  setMessage,
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [popupOpenChatId, setPopupOpenChatId] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingChatTitle, setEditingChatTitle] = useState("");
  const [user, setUser] = useState<
    { email: string; name?: string } | undefined
  >(undefined);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return;
      }

      setUser({
        email: user.email!,
        name: user.user_metadata.name,
      });
    };

    getUser();
  }, [router]);

  const popupRef = useRef<HTMLDivElement | null>(null);
  // Close popup only if click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopupOpenChatId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNewChat = () => {
    setMessages([]);
    setSelectedChatId(null);
    setMessage("");
    setSidebarOpen(false);
  };

  const handleSelectChat = (chat: Chat) => {
    setMessages(chat.messages);
    setSelectedChatId(chat.id);
    setSidebarOpen(false);
    setPopupOpenChatId(null);
    setEditingChatId(null);
  };

  const handleRenameChat = async (chatId: string) => {
    const newTitle = editingChatTitle.trim();
    if (!newTitle) {
      setEditingChatId(null);
      return;
    }
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, title: newTitle } : c))
    );
    setEditingChatId(null);

    if (user) {
      await supabase.from("chats").update({ title: newTitle }).eq("id", chatId);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (selectedChatId === chatId) {
      setMessages([]);
      setSelectedChatId(null);
    }
    setPopupOpenChatId(null);
    setEditingChatId(null);

    if (user) {
      await supabase.from("chats").delete().eq("id", chatId);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-gray-800 hover:bg-[#181818]"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      <aside
        className={`fixed md:static top-0 left-0 h-full 
        ${sidebarOpen ? "w-64" : "w-14"}
        bg-[#181818] border-r border-[#313130] z-40 transition-all duration-300 ease-in-out flex flex-col py-4 px-2
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Toggle (desktop) */}
        <div
          className="hidden md:flex items-center cursor-pointer px-2 py-2 rounded-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <PanelRight className="w-5 h-5 shrink-0" />
          {sidebarOpen && (
            <span className="ml-4 text-lg font-bold whitespace-nowrap">
              ChatSphere
            </span>
          )}
        </div>

        {/* New Chat */}
        <div
          onClick={handleNewChat}
          className="flex items-center cursor-pointer px-2 py-2 rounded-full bg-[#313130] transition-all duration-300 ease-in-out mt-20 lg:mt-10 lg:mb-8"
        >
          <Plus className="w-6 h-6 shrink-0" />
          {sidebarOpen && <span className="ml-2 text-md lg:text-sm">New</span>}
        </div>

        {/* Search */}
        {sidebarOpen && (
          <input
            type="text"
            placeholder="Search chats..."
            className="mt-5 lg:mt-2 mb-2 p-2 text-md lg:text-sm rounded-md bg-[#313130] w-full focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {sidebarOpen && (
            <h1 className="text-md lg:text-sm ml-2 my-5">Chats</h1>
          )}
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`relative group flex items-center justify-between px-2 py-2 cursor-pointer rounded-md text-sm hover:bg-[#313130] ${
                selectedChatId === chat.id ? "bg-[#313130]" : ""
              }`}
            >
              <div
                className="flex items-center flex-1 truncate"
                onClick={() => handleSelectChat(chat)}
              >
                {!sidebarOpen ? (
                  <MessageCircleDashed className="w-5 h-5 shrink-0 mr-2" />
                ) : null}

                {sidebarOpen &&
                  (chat.id === editingChatId ? (
                    <input
                      className="bg-transparent text-white border-b border-gray-600 text-sm w-full"
                      value={editingChatTitle}
                      onChange={(e) => setEditingChatTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameChat(chat.id);
                        if (e.key === "Escape") setEditingChatId(null);
                      }}
                      onBlur={() => handleRenameChat(chat.id)}
                      autoFocus
                    />
                  ) : (
                    <span className="truncate text-md lg:text-sm">
                      {chat.title}
                    </span>
                  ))}
              </div>

              {/* three-dot menu */}
              {sidebarOpen && (
                <div className="relative" ref={popupRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPopupOpenChatId((prev) =>
                        prev === chat.id ? null : chat.id
                      );
                    }}
                    // 👇 Always visible on mobile, only visible on hover for md+
                    className="md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1"
                    title="Open menu"
                  >
                    <Ellipsis className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>

                  {/* Popup */}
                  {popupOpenChatId === chat.id && (
                    <div className="absolute right-0 mt-2 w-36 bg-[#202120] border border-[#313130] rounded-md shadow-lg z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingChatId(chat.id);
                          setEditingChatTitle(chat.title);
                          setPopupOpenChatId(null);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-[#313130]"
                      >
                        <Pencil className="w-4 h-4" /> Rename
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(chat.id);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-[#313130] hover:text-red-500"
                      >
                        <Trash className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer (user) */}
        <div className="User">
          <UserMenu user={user} sidebarOpen={sidebarOpen} />
        </div>
      </aside>
    </>
  );
}

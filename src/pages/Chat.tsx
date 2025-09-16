import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role?: string | null;
  user_id?: string | null;
};

type Message = {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string | null;
  is_dm: boolean;
  sent_at: string;
};

const Chat = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, display_name, avatar_url, role")
        .order("display_name", { ascending: true });
      if (error) throw error;
      return (data as Profile[]) || [];
    },
    // Load user list regardless; we'll disable actions until a user/profile exists
    enabled: true,
  });

  const conversationKey = useMemo(() => ["messages", profile?.id, selectedUser?.id], [profile?.id, selectedUser?.id]);

  const { data: messagesData = { messages: [] }, refetch } = useQuery<{ messages: Message[] }>({
    queryKey: conversationKey,
    queryFn: async () => {
      if (!profile?.id || !selectedUser?.id) return { messages: [] };
      const { data, error } = await supabase
        .from("messages")
        .select("id, content, sender_id, recipient_id, is_dm, sent_at")
        .eq("is_dm", true)
        .or(
          `and(sender_id.eq.${profile.id},recipient_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},recipient_id.eq.${profile.id})`
        )
        .order("sent_at", { ascending: true });
      if (error) throw error;
      return { messages: (data as Message[]) || [] };
    },
    enabled: !!profile?.id && !!selectedUser?.id,
  });

  useEffect(() => {
    if (!profile?.id) return;
    const channel = supabase
      .channel("messages_dm")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const m = payload.new as Message;
          if (
            m.is_dm &&
            ((m.sender_id === profile?.id && m.recipient_id === selectedUser?.id) ||
              (m.sender_id === selectedUser?.id && m.recipient_id === profile?.id))
          ) {
            // Refresh the conversation when a relevant message arrives
            refetch();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, selectedUser?.id, refetch]);

  // Auto-select first available user for convenience
  useEffect(() => {
    if (!selectedUser && users && users.length > 0) {
      // Exclude current user if we can match by user_id
      const filtered = users.filter((u) => u.user_id !== (profile as any)?.user_id);
      setSelectedUser((filtered[0] || users[0]) as Profile);
    }
  }, [users, selectedUser, profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData?.messages?.length]);

  const sendMessage = async () => {
    if (!message.trim() || !profile?.id || !selectedUser?.id) return;
    const { error } = await supabase.from("messages").insert({
      content: message.trim(),
      sender_id: profile.id,
      recipient_id: selectedUser.id,
      is_dm: true,
      sent_at: new Date().toISOString(),
    });
    if (!error) setMessage("");
  };

  return (
    <div className="p-6 h-[calc(100vh-2rem)]">
      <Card className="h-full">
        <CardHeader className="border-b border-border">
          <CardTitle>{t("chat.title")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-full flex">
          {/* Users List */}
          <div className="w-64 border-r border-border p-4 overflow-y-auto">
            <Input
              placeholder={t("chat.searchUsers")}
              className="mb-3"
              onChange={() => {}}
            />
            {usersLoading ? (
              <div className="text-sm text-muted-foreground">{t("loading")}</div>
            ) : (
              <div className="space-y-2">
                {users && users.length === 0 && (
                  <div className="text-xs text-muted-foreground">{t("chat.noUsers")}</div>
                )}
                {users?.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors ${
                      selectedUser?.id === u.id ? "bg-secondary" : "hover:bg-secondary/50"
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={u.avatar_url || undefined} />
                      <AvatarFallback>{u.display_name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="truncate">
                      <div className="font-medium truncate">{u.display_name || t("chat.unknownUser")}</div>
                      {u.role && (
                        <div className="text-[10px] text-muted-foreground">{t(`profile.role.${u.role}`)}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Conversation */}
          <div className="flex-1 flex flex-col">
            {!selectedUser ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                {t("chat.selectPrompt")}
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-border">
                  <div className="font-semibold">{selectedUser.display_name || t("chat.unknownUser")}</div>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {messagesData?.messages?.length ? (
                      messagesData.messages.map((m) => {
                        const mine = m.sender_id === profile?.id;
                        return (
                          <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                                mine ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                              }`}
                            >
                              <div>{m.content}</div>
                              <div className="text-[10px] opacity-70 mt-1">
                                {new Date(m.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-sm text-muted-foreground py-8 space-y-4">
                        <div>{t("chat.noMessages")}</div>
                        <div className="text-foreground font-medium">{t("chat.sampleHeader")}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                          {(["artist", "arranger", "engineer", "admin"] as const).map((roleKey) => {
                            const samplesMaybe = t(`chat.samples.${roleKey}`, { returnObjects: true }) as unknown;
                            const samples = Array.isArray(samplesMaybe) ? samplesMaybe : [];
                            return (
                              <div key={roleKey} className="p-3 rounded-md bg-secondary/50">
                                <div className="text-xs text-muted-foreground mb-2">{t(`profile.role.${roleKey}`)}</div>
                                <div className="flex flex-wrap gap-2">
                                  {samples.slice(0, 3).map((s, idx) => (
                                    <Button key={idx} size="sm" variant="outline" onClick={() => setMessage(s)}>
                                      {s}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="p-4 border-t border-border flex gap-2">
                  <Input
                    placeholder={t("chat.typeMessage")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button onClick={sendMessage}>{t("chat.send")}</Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;

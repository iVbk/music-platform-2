import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Paperclip, Music, Users, Clock } from "lucide-react";

const ProductionRooms = () => {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState("");

  const rooms = [
    {
      id: 1,
      trackTitle: "Midnight Dreams",
      artist: "新人アーティスト A",
      arranger: "田中 良子",
      engineer: "佐藤 健太",
      status: "in_progress",
      lastMessage: "ミックスが完成しました！",
      lastMessageTime: "2 min ago",
      unread: 2
    },
    {
      id: 2,
      trackTitle: "Urban Flow", 
      artist: "新人アーティスト B",
      arranger: "山田 美咲",
      engineer: null,
      status: "setup",
      lastMessage: "エンジニアの方をお待ちしています",
      lastMessageTime: "1 hour ago",
      unread: 0
    },
    {
      id: 3,
      trackTitle: "Silent Waves",
      artist: "新人アーティスト C",
      arranger: "鈴木 太郎",
      engineer: "高橋 花子",
      status: "review",
      lastMessage: "最終確認をお願いします",
      lastMessageTime: "3 hours ago",
      unread: 1
    }
  ];

  const messages = [
    {
      id: 1,
      user: "Admin",
      message: "プロジェクトを開始します。よろしくお願いします！",
      time: "10:00 AM",
      isFile: false
    },
    {
      id: 2,
      user: "田中 良子",
      message: "アレンジを開始しました。まず基本的なコード進行を確認しませんか？",
      time: "10:15 AM",
      isFile: false
    },
    {
      id: 3,
      user: "新人アーティスト A",
      message: "はい！楽しみにしています。こちらが参考音源です。",
      time: "10:20 AM",
      isFile: true,
      fileName: "reference-track.mp3"
    },
    {
      id: 4,
      user: "佐藤 健太",
      message: "ミックスが完成しました！確認をお願いします。",
      time: "2:30 PM",
      isFile: true,
      fileName: "midnight-dreams-mix-v1.wav"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      setup: { variant: "secondary" as const, text: "セットアップ中" },
      in_progress: { variant: "default" as const, text: "制作中" },
      review: { variant: "outline" as const, text: "レビュー中" },
      completed: { variant: "secondary" as const, text: "完成" }
    };
    return variants[status as keyof typeof variants] || variants.setup;
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="p-8 h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-foreground mb-2">制作ルーム</h1>
        <p className="text-muted-foreground">チームとリアルタイムでコラボレーション</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Room List */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border shadow-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent" />
                アクティブなルーム ({rooms.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-2 p-4">
                  {rooms.map((room) => {
                    const statusInfo = getStatusBadge(room.status);
                    return (
                      <div
                        key={room.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedRoom === room.id
                            ? "border-accent bg-accent/10 shadow-neon"
                            : "border-border bg-secondary/30 hover:bg-secondary"
                        }`}
                        onClick={() => setSelectedRoom(room.id)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm truncate">{room.trackTitle}</h4>
                            {room.unread > 0 && (
                              <Badge variant="destructive" className="text-xs px-1 py-0">
                                {room.unread}
                              </Badge>
                            )}
                          </div>
                          <Badge {...statusInfo} className="text-xs">
                            {statusInfo.text}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            <p>🎤 アーティスト: {room.artist}</p>
                            <p>🎹 アレンジャー: {room.arranger}</p>
                            <p>🎧 エンジニア: {room.engineer || "待機中..."}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <p className="truncate">{room.lastMessage}</p>
                            <p className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {room.lastMessageTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          {selectedRoom ? (
            <Card className="bg-card border-border shadow-card h-full flex flex-col">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-accent" />
                    {rooms.find(r => r.id === selectedRoom)?.trackTitle}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">4 メンバー</span>
                    <Badge variant="outline" className="text-xs">進行中</Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{message.user}</span>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">{message.message}</p>
                          {message.isFile && (
                            <div className="mt-2 p-2 bg-accent/10 rounded border border-accent/20 flex items-center gap-2">
                              <Paperclip className="w-4 h-4 text-accent" />
                              <span className="text-sm text-accent">{message.fileName}</span>
                              <Button size="sm" variant="ghost" className="ml-auto text-xs">
                                ダウンロード
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t border-border p-4">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="メッセージを入力..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      size="sm" 
                      className="bg-gradient-neon hover:shadow-neon"
                      onClick={handleSendMessage}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-border shadow-card h-full">
              <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">制作ルームを選択</h3>
                      <p className="text-muted-foreground">コラボレーションを開始するルームを選んでください</p>
                    </div>
                  </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionRooms;
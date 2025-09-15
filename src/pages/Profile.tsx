import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Music, Star, Calendar, MapPin, Edit, Save, Play, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [demoFile, setDemoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const mockProjects = [
    {
      id: 1,
      title: "Midnight Dreams",
      artist: "新人アーティスト A",
      role: "アレンジャー",
      status: "完成",
      date: "2024-01",
      streams: "15,200",
      royalty: "¥12,350"
    },
    {
      id: 2,
      title: "Urban Flow",
      artist: "新人アーティスト B", 
      role: "エンジニア",
      status: "制作中",
      date: "2024-02",
      streams: "8,500",
      royalty: "¥6,800"
    },
    {
      id: 3,
      title: "Silent Waves",
      artist: "新人アーティスト C", 
      role: "アレンジャー",
      status: "完成",
      date: "2023-12",
      streams: "23,100",
      royalty: "¥18,480"
    },
    {
      id: 4,
      title: "Digital Rain",
      artist: "新人アーティスト D", 
      role: "エンジニア",
      status: "配信中",
      date: "2024-03",
      streams: "31,750",
      royalty: "¥25,400"
    }
  ];

  const handleDemoUpload = async () => {
    if (!demoFile || !profile) return;

    setUploading(true);
    try {
      const fileExt = demoFile.name.split('.').pop();
      const fileName = `demo_${profile.id}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('demo-tracks')
        .upload(fileName, demoFile);

      if (uploadError) throw uploadError;

      toast({
        title: "アップロード完了",
        description: "デモ音源がアップロードされました。審査をお待ちください。",
      });
      
      setDemoFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "アップロードエラー",
        description: "ファイルのアップロードに失敗しました。",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      artist: "アーティスト",
      arranger: "アレンジャー",
      engineer: "エンジニア",
      admin: "管理者"
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <div className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">マイプロフィール</h1>
        <p className="text-muted-foreground">プロフィール情報を管理し、実績を確認しましょう</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="bg-card border-border shadow-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              プロフィール
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-gradient-neon text-primary-foreground text-xl">
                  {profile?.display_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              {profile?.role === "artist" && (
                <Button size="sm" variant="outline" className="text-xs">
                  <Upload className="w-3 h-3 mr-1" />
                  アー写をアップロード
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="display-name">表示名</Label>
                {isEditing ? (
                  <Input
                    id="display-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-lg font-medium mt-1">{profile?.display_name}</p>
                )}
              </div>

              <div>
                <Label>役割</Label>
                <Badge variant="secondary" className="mt-1 block w-fit">
                  {getRoleLabel(profile?.role || "")}
                </Badge>
              </div>

              <div>
                <Label htmlFor="bio">プロフィール</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="自己紹介を入力してください..."
                    className="mt-1 min-h-[100px]"
                  />
                ) : (
                  <p className="text-muted-foreground mt-1">
                    {profile?.bio || "まだプロフィールが設定されていません"}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                参加日: {new Date(profile?.created_at || "").toLocaleDateString("ja-JP")}
              </div>
            </div>

            {profile?.role === "artist" && (
              <div className="space-y-3">
                <Label>デモ音源アップロード</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <Music className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {demoFile ? demoFile.name : "デモ音源をアップロード"}
                  </p>
                  <p className="text-xs text-accent mb-3">
                    ※ アップロードされたデモ音源は社内のみ視聴可能です
                  </p>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setDemoFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="demo-upload"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => document.getElementById('demo-upload')?.click()}
                      disabled={uploading}
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      ファイルを選択
                    </Button>
                    {demoFile && (
                      <Button 
                        size="sm" 
                        className="bg-gradient-neon hover:shadow-neon" 
                        onClick={handleDemoUpload}
                        disabled={uploading}
                      >
                        {uploading ? "アップロード中..." : "アップロード"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="projects">制作実績</TabsTrigger>
              <TabsTrigger value="achievements">実績・評価</TabsTrigger>
              {(profile?.role === "arranger" || profile?.role === "engineer") && (
                <TabsTrigger value="history">過去の制作履歴</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="projects" className="space-y-4">
              <Card className="bg-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-accent" />
                    参加プロジェクト
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mockProjects.length > 0 ? (
                    <div className="space-y-4">
                      {mockProjects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                        >
                          <div className="space-y-1">
                            <h4 className="font-semibold">{project.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              by {project.artist}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {project.role}
                              </Badge>
                              <Badge
                                variant={project.status === "完成" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {project.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-sm font-medium">{project.streams} streams</p>
                            <p className="text-xs text-accent font-medium">{project.royalty}</p>
                            <p className="text-xs text-muted-foreground">{project.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        まだプロジェクトがありません
                      </h3>
                      <p className="text-muted-foreground">
                        プロジェクトに参加すると、ここに表示されます
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <Card className="bg-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-accent" />
                    実績・評価
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">12</div>
                      <p className="text-sm text-muted-foreground">完成プロジェクト</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">4.8</div>
                      <p className="text-sm text-muted-foreground">平均評価</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">125K</div>
                      <p className="text-sm text-muted-foreground">総ストリーム数</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">¥84,500</div>
                      <p className="text-sm text-muted-foreground">総収益</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">獲得バッジ</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        ファーストプロジェクト
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Music className="w-3 h-3" />
                        10プロジェクト達成
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {(profile?.role === "arranger" || profile?.role === "engineer") && (
              <TabsContent value="history" className="space-y-4">
                <Card className="bg-card border-border shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-accent" />
                      過去の制作履歴
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockProjects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-neon flex items-center justify-center">
                              <Music className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-semibold">{project.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                by {project.artist}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {project.role}
                                </Badge>
                                <Badge
                                  variant={project.status === "完成" ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {project.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="flex items-center gap-2">
                              <Play className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{project.streams}</span>
                            </div>
                            <p className="text-sm text-accent font-medium">{project.royalty}</p>
                            <p className="text-xs text-muted-foreground">{project.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
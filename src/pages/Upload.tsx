import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload as UploadIcon, Music, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Upload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const { user, profile } = useAuth();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        setIsUploaded(true);
      } else {
        toast({
          title: "無効なファイル形式",
          description: "音声ファイルをアップロードしてください",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        setIsUploaded(true);
      } else {
        toast({
          title: "無効なファイル形式",
          description: "音声ファイルをアップロードしてください",
          variant: "destructive",
        });
      }
    }
  };

  const uploadToStorage = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('demo-tracks')
      .upload(fileName, file);

    if (error) {
      console.error('Storage upload error:', error);
      return null;
    }

    return fileName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioFile || !profile || !user) {
      toast({
        title: "エラー",
        description: "ログインしてファイルを選択してください",
        variant: "destructive",
      });
      return;
    }

    if (profile.role !== 'artist') {
      toast({
        title: "アクセス拒否",
        description: "デモ音源のアップロードはアーティストのみ可能です",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      // Upload file to storage
      const audioUrl = await uploadToStorage(audioFile);
      
      if (!audioUrl) {
        throw new Error('音声ファイルのアップロードに失敗しました');
      }

      // Insert demo track record
      const { error: dbError } = await supabase
        .from('demo_tracks')
        .insert({
          artist_id: profile.id,
          title,
          genre,
          description,
          audio_url: audioUrl,
          status: 'pending'
        });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "デモ音源を送信しました！",
        description: "デモ音源が審査のために送信されました。審査完了後にお知らせします。",
      });

      // Reset form
      setAudioFile(null);
      setTitle("");
      setGenre("");
      setDescription("");
      setIsUploaded(false);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "アップロード失敗",
        description: error.message || "デモ音源のアップロードに失敗しました",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">マイページ - デモ音源アップロード</h1>
        <p className="text-muted-foreground">開発チームによる審査・コラボレーションのために、あなたの音楽をシェアしてください</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              デモ音源をアップロード
            </CardTitle>
            <CardDescription>
              開発チームによる審査のためにデモ音源をアップロードしてください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch 
                id="demo-mode" 
                checked={isDemo}
                onCheckedChange={setIsDemo}
              />
              <Label htmlFor="demo-mode">デモ音源</Label>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isUploaded ? (
                <div className="flex flex-col items-center gap-4">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <div>
                    <h3 className="font-semibold">ファイルのアップロードが完了しました！</h3>
                    <p className="text-sm text-muted-foreground">
                      {audioFile?.name} - デモ音源を送信する準備ができました
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <UploadIcon className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold">音声ファイルをここにドロップ</h3>
                    <p className="text-sm text-muted-foreground">またはクリックして選択</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      対応形式: MP3, WAV, FLAC（最大50MB）
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileInput}
                    className="hidden"
                    id="audio-upload"
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="audio-upload" className="cursor-pointer">
                      ファイルを選択
                    </label>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>楽曲詳細</CardTitle>
            <CardDescription>
              楽曲に関する情報を入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">楽曲タイトル</Label>
                  <Input 
                    id="title" 
                    placeholder="楽曲タイトルを入力" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="genre">ジャンル</Label>
                  <Select value={genre} onValueChange={setGenre} required>
                    <SelectTrigger>
                      <SelectValue placeholder="ジャンルを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {["ポップス", "ロック", "ヒップホップ", "エレクトロニック", "ジャズ", "クラシック", "R&B", "カントリー"].map((genreItem) => (
                        <SelectItem key={genreItem} value={genreItem.toLowerCase()}>
                          {genreItem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">楽曲について</Label>
                <Textarea 
                  id="description" 
                  placeholder="楽曲について教えてください..."
                  className="min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">デモ音源ガイドライン</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• デモ音源は開発・マネジメントチームのみがアクセス可能です</li>
                  <li>• オリジナル楽曲であることを確認してください</li>
                  <li>• 音楽スタイルについて簡潔に説明してください</li>
                  <li>• 高音質の音声ファイルを推奨します</li>
                  <li>• 楽曲の権利は当社に帰属し、印税分配の対象となります</li>
                </ul>
              </div>

              <Button 
                type="submit"
                className="w-full"
                disabled={!isUploaded || uploading || !title || !genre}
              >
                {uploading ? "アップロード中..." : "デモ音源を送信"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
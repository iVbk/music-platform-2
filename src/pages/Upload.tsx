import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload as UploadIcon, Music, File, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Upload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setIsUploaded(true);
  };

  const genres = [
    "Electronic", "Hip-Hop", "Pop", "Rock", "Jazz", "Classical", 
    "R&B", "Country", "Folk", "Ambient", "Experimental", "World"
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">My Page - Demo Upload</h1>
        <p className="text-muted-foreground">Upload your demo tracks for review and potential collaboration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Area */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5 text-accent" />
              Audio File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
                isDragOver
                  ? "border-accent bg-accent/10 shadow-neon"
                  : "border-border hover:border-accent/50",
                isUploaded && "border-accent bg-accent/5"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isUploaded ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-neon rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Track uploaded successfully!</h3>
                    <p className="text-sm text-muted-foreground">my-awesome-track.mp3 (4.2 MB)</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Replace File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center">
                    <UploadIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Drop your audio file here</h3>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supports MP3, WAV, FLAC (max 50MB)
                    </p>
                  </div>
                  <Button className="bg-gradient-neon hover:shadow-neon transition-all duration-300">
                    <File className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                </div>
              )}
            </div>

            {/* Demo/Full Track Toggle */}
            <div className="mt-6 p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="demo-toggle" className="text-sm font-medium">
                    Demo Track
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Upload a preview version to protect your full work
                  </p>
                </div>
                <Switch
                  id="demo-toggle"
                  checked={isDemo}
                  onCheckedChange={setIsDemo}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Track Details */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle>Track Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Track Title</Label>
              <Input 
                id="title" 
                placeholder="Enter your track title..."
                className="bg-input border-border focus:ring-accent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre.toLowerCase()}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your track, the vibe you're going for, or what kind of collaboration you're looking for..."
                className="bg-input border-border focus:ring-accent min-h-[120px]"
              />
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <h4 className="font-medium text-accent mb-2">Demo Track Guidelines</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Demo tracks are only viewable by our development team</li>
                  <li>• Keep demos under 1 minute for initial review</li>
                  <li>• Full tracks will be requested after approval</li>
                  <li>• Include your best work that represents your style</li>
                </ul>
              </div>
              
              <Button 
                className="w-full bg-gradient-neon hover:shadow-neon transition-all duration-300"
                disabled={!isUploaded}
              >
                Submit Demo for Review
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Demo will be reviewed within 3-5 business days
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
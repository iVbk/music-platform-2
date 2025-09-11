import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import { Play, Pause, Check, X, Music, User, Calendar } from "lucide-react";

const DemoReview = () => {
  const [selectedDemo, setSelectedDemo] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState("");

  const demoTracks = [
    {
      id: 1,
      title: "Midnight Dreams",
      artist: "新人アーティスト A",
      genre: "Electronic",
      duration: "3:24",
      submitted: "2024-01-15",
      status: "pending"
    },
    {
      id: 2,
      title: "Urban Flow",
      artist: "新人アーティスト B", 
      genre: "Hip-Hop",
      duration: "2:58",
      submitted: "2024-01-14",
      status: "pending"
    },
    {
      id: 3,
      title: "Silent Waves",
      artist: "新人アーティスト C",
      genre: "Ambient",
      duration: "4:12",
      submitted: "2024-01-13", 
      status: "pending"
    }
  ];

  const handleApprove = (id: number) => {
    console.log(`Approved demo ${id}`);
    // Here would implement the approval logic
  };

  const handleReject = (id: number) => {
    console.log(`Rejected demo ${id} with feedback: ${feedback}`);
    // Here would implement the rejection logic
  };

  return (
    <div className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Demo Review</h1>
        <p className="text-muted-foreground">Review and select demo tracks from new artists</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Demo List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-accent" />
                Pending Demo Tracks ({demoTracks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {demoTracks.map((demo) => (
                <div
                  key={demo.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedDemo === demo.id
                      ? "border-accent bg-accent/10 shadow-neon"
                      : "border-border bg-secondary/50 hover:bg-secondary"
                  }`}
                  onClick={() => setSelectedDemo(demo.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <WaveformVisualizer 
                        className="w-20 h-12" 
                        data={Array.from({ length: 15 }, () => Math.random())}
                        animated={selectedDemo === demo.id && isPlaying}
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-foreground">{demo.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{demo.artist}</span>
                        <Badge variant="secondary" className="text-xs">{demo.genre}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{demo.duration}</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{demo.submitted}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlaying(!isPlaying);
                      }}
                    >
                      {isPlaying && selectedDemo === demo.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Review Panel */}
        <div className="space-y-6">
          {selectedDemo ? (
            <>
              <Card className="bg-card border-border shadow-card">
                <CardHeader>
                  <CardTitle>Review Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Feedback (Optional)</label>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Add feedback for the artist..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
                      onClick={() => selectedDemo && handleApprove(selectedDemo)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve & Proceed to Coordination
                    </Button>
                    
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => selectedDemo && handleReject(selectedDemo)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-card">
                <CardHeader>
                  <CardTitle>Artist Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-gradient-neon rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {demoTracks.find(d => d.id === selectedDemo)?.artist}
                      </h4>
                      <p className="text-sm text-muted-foreground">New Artist</p>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Genre:</span> {demoTracks.find(d => d.id === selectedDemo)?.genre}</p>
                      <p><span className="font-medium">Joined:</span> January 2024</p>
                      <p><span className="font-medium">Demos Submitted:</span> 1</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-card border-border shadow-card">
              <CardContent className="p-8 text-center">
                <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a demo track to review</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoReview;
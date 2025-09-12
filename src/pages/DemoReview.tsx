import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Pause, CheckCircle, XCircle, Clock, User } from "lucide-react";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface DemoTrack {
  id: string;
  title: string;
  genre: string;
  description?: string;
  audio_url: string;
  status: string;
  submitted_at: string;
  feedback?: string;
  profiles: {
    id: string;
    display_name: string;
    avatar_url?: string;
  } | null;
}

const DemoReview = () => {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [demos, setDemos] = useState<DemoTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    fetchDemos();
  }, []);

  const fetchDemos = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_tracks')
        .select(`
          *,
          profiles:artist_id (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      setDemos(data || []);
    } catch (error) {
      console.error('Error fetching demos:', error);
      toast({
        title: "Error",
        description: "Failed to load demo tracks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (demoId: string) => {
    try {
      const { error } = await supabase
        .from('demo_tracks')
        .update({
          status: 'approved',
          feedback: feedback,
          reviewed_at: new Date().toISOString(),
          reviewed_by: profile?.id
        })
        .eq('id', demoId);

      if (error) throw error;

      toast({
        title: "Demo approved",
        description: "The demo track has been approved successfully",
      });

      // Refresh the list
      fetchDemos();
      setSelectedDemo(null);
      setFeedback("");
    } catch (error) {
      console.error('Error approving demo:', error);
      toast({
        title: "Error",
        description: "Failed to approve demo track",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (demoId: string) => {
    try {
      const { error } = await supabase
        .from('demo_tracks')
        .update({
          status: 'rejected',
          feedback: feedback,
          reviewed_at: new Date().toISOString(),
          reviewed_by: profile?.id
        })
        .eq('id', demoId);

      if (error) throw error;

      toast({
        title: "Demo rejected",
        description: "The demo track has been rejected with feedback",
      });

      // Refresh the list
      fetchDemos();
      setSelectedDemo(null);
      setFeedback("");
    } catch (error) {
      console.error('Error rejecting demo:', error);
      toast({
        title: "Error",
        description: "Failed to reject demo track",
        variant: "destructive",
      });
    }
  };

  const getAudioUrl = (audioPath: string) => {
    const { data } = supabase.storage
      .from('demo-tracks')
      .getPublicUrl(audioPath);
    return data.publicUrl;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedDemoData = demos.find(demo => demo.id === selectedDemo);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Demo Review</h1>
        <p className="text-muted-foreground">Review and approve demo tracks from new artists</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Demo Tracks ({demos.length})</CardTitle>
            <CardDescription>
              Click on a track to review and provide feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {demos.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No pending demos to review</p>
              ) : (
                demos.map((demo) => (
                  <div
                    key={demo.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedDemo === demo.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedDemo(demo.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{demo.title}</h3>
                          <Badge variant="secondary">{demo.genre}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          by {demo.profiles?.display_name || 'Unknown Artist'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(demo.submitted_at)}
                          </span>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending
                          </Badge>
                        </div>
                        <WaveformVisualizer />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPlaying(!isPlaying);
                        }}
                      >
                        {isPlaying && selectedDemo === demo.id ? 
                          <Pause className="w-4 h-4" /> : 
                          <Play className="w-4 h-4" />
                        }
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {selectedDemoData ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Review: {selectedDemoData.title}</CardTitle>
                  <CardDescription>Provide feedback and make a decision</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Feedback</h4>
                    <Textarea
                      placeholder="Provide feedback to the artist..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleApprove(selectedDemoData.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      onClick={() => handleReject(selectedDemoData.id)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Artist Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedDemoData.profiles?.avatar_url || ""} />
                      <AvatarFallback>
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium">{selectedDemoData.profiles?.display_name || 'Unknown Artist'}</h3>
                      <p className="text-sm text-muted-foreground">Artist</p>
                      {selectedDemoData.description && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-1">Track Description:</h4>
                          <p className="text-sm text-muted-foreground">{selectedDemoData.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a demo track to review</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoReview;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import { Upload, Play, Heart, TrendingUp, Users, Music } from "lucide-react";

const Dashboard = () => {
  const trendingSongs = [
    { title: "Midnight Dreams", artist: "Alex Chen", genre: "Electronic", likes: 1240, producer: "Sarah M." },
    { title: "Urban Nights", artist: "Jordan Blue", genre: "Hip-Hop", likes: 980, producer: "Mike K." },
    { title: "Ethereal", artist: "Luna Sky", genre: "Ambient", likes: 756, producer: "David R." },
  ];

  const topProducers = [
    { name: "Sarah Martinez", specialties: ["Electronic", "Pop"], rating: 4.9, projects: 47 },
    { name: "Mike Rodriguez", specialties: ["Hip-Hop", "R&B"], rating: 4.8, projects: 52 },
    { name: "David Chen", specialties: ["Ambient", "Cinematic"], rating: 4.7, projects: 38 },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">Ready to create something amazing?</p>
        </div>
        <Button className="bg-gradient-neon hover:shadow-neon transition-all duration-300">
          <Upload className="w-4 h-4 mr-2" />
          Upload Track
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border shadow-card hover:shadow-elevated transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-accent">+2 this week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-card hover:shadow-elevated transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$2,847</div>
            <p className="text-xs text-accent">+$340 this month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-card hover:shadow-elevated transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Collaborations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8</div>
            <p className="text-xs text-accent">3 pending review</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-card hover:shadow-elevated transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">15.2K</div>
            <p className="text-xs text-accent">+1.8K this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trending Songs */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Trending Songs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trendingSongs.map((song, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="flex-shrink-0">
                  <WaveformVisualizer className="w-16 h-8" data={Array.from({ length: 12 }, () => Math.random())} />
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-foreground">{song.title}</h4>
                  <p className="text-sm text-muted-foreground">by {song.artist}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{song.genre}</Badge>
                    <span className="text-xs text-muted-foreground">with {song.producer}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{song.likes}</span>
                  <Button size="sm" variant="ghost" className="ml-2">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Producers */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Top Producers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducers.map((producer, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-neon flex items-center justify-center">
                  <Music className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-foreground">{producer.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {producer.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ⭐ {producer.rating} • {producer.projects} projects
                  </p>
                </div>
                <Button size="sm" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  Connect
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
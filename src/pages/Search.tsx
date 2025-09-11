import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search as SearchIcon, Music, Star, MapPin, Calendar } from "lucide-react";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterGenre, setFilterGenre] = useState("all");

  const professionals = [
    {
      id: 1,
      name: "田中 良子",
      role: "arranger",
      specialties: ["Electronic", "Pop", "Ambient"],
      rating: 4.9,
      projects: 47,
      location: "東京",
      bio: "10年以上の経験を持つアレンジャーです。エレクトロニックミュージックを得意としています。",
      joinDate: "2022-03",
      verified: true
    },
    {
      id: 2,
      name: "佐藤 健太",
      role: "engineer",
      specialties: ["Hip-Hop", "R&B", "Jazz"],
      rating: 4.8,
      projects: 52,
      location: "大阪",
      bio: "Grammy受賞エンジニアのアシスタント経験があります。ミックス・マスタリング専門。",
      joinDate: "2021-11",
      verified: true
    },
    {
      id: 3,
      name: "山田 美咲",
      role: "arranger",
      specialties: ["Rock", "Metal", "Alternative"],
      rating: 4.7,
      projects: 38,
      location: "福岡",
      bio: "バンド活動の経験を活かしたロックアレンジが得意です。",
      joinDate: "2023-01",
      verified: false
    },
    {
      id: 4,
      name: "鈴木 太郎",
      role: "engineer",
      specialties: ["Classical", "Orchestral", "World"],
      rating: 4.6,
      projects: 31,
      location: "京都",
      bio: "オーケストラレコーディング専門。アコースティック楽器の録音が得意。",
      joinDate: "2022-08",
      verified: true
    }
  ];

  const getRoleLabel = (role: string) => {
    const labels = {
      arranger: "アレンジャー",
      engineer: "エンジニア"
    };
    return labels[role as keyof typeof labels] || role;
  };

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prof.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = filterRole === "all" || prof.role === filterRole;
    const matchesGenre = filterGenre === "all" || prof.specialties.some(s => s === filterGenre);
    
    return matchesSearch && matchesRole && matchesGenre;
  });

  return (
    <div className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Search Professionals</h1>
        <p className="text-muted-foreground">Find arrangers and engineers for your music projects</p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SearchIcon className="w-5 h-5 text-accent" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="名前やスキルで検索..."
                className="bg-input border-border"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての役割</SelectItem>
                  <SelectItem value="arranger">アレンジャー</SelectItem>
                  <SelectItem value="engineer">エンジニア</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Genre</label>
              <Select value={filterGenre} onValueChange={setFilterGenre}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべてのジャンル</SelectItem>
                  <SelectItem value="Electronic">Electronic</SelectItem>
                  <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
                  <SelectItem value="Pop">Pop</SelectItem>
                  <SelectItem value="Rock">Rock</SelectItem>
                  <SelectItem value="Jazz">Jazz</SelectItem>
                  <SelectItem value="Classical">Classical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">
            Search Results ({filteredProfessionals.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProfessionals.map((professional) => (
            <Card key={professional.id} className="bg-card border-border shadow-card hover:shadow-elevated transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-neon flex items-center justify-center">
                      <Music className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{professional.name}</CardTitle>
                        {professional.verified && (
                          <Badge variant="secondary" className="text-xs">
                            認証済み
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {getRoleLabel(professional.role)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{professional.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{professional.projects} projects</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{professional.bio}</p>
                
                <div className="flex flex-wrap gap-1">
                  {professional.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{professional.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>参加: {professional.joinDate}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-neon hover:shadow-neon transition-all duration-300">
                    Contact
                  </Button>
                  <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-8 text-center">
              <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Search;
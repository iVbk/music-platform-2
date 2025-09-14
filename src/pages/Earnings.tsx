import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, Music, Calendar, AlertTriangle } from "lucide-react";

const Earnings = () => {
  const royaltyBreakdown = [
    { role: "アーティスト", percentage: 70, amount: 84500, color: "bg-gradient-to-r from-blue-500 to-purple-500" },
    { role: "アレンジャー", percentage: 15, amount: 18150, color: "bg-gradient-to-r from-green-500 to-teal-500" },
    { role: "エンジニア", percentage: 15, amount: 18150, color: "bg-gradient-to-r from-orange-500 to-red-500" }
  ];

  const monthlyEarnings = [
    { month: "2024年1月", amount: 12500, streams: 15200 },
    { month: "2024年2月", amount: 18200, streams: 22100 },
    { month: "2024年3月", amount: 25800, streams: 31500 },
    { month: "2024年4月", amount: 34000, streams: 41200 }
  ];

  const tracks = [
    {
      id: 1,
      title: "Midnight Dreams",
      artist: "新人アーティスト A",
      streams: 15200,
      earnings: 18400,
      royalty: 70,
      status: "配信中"
    },
    {
      id: 2,
      title: "Urban Flow",
      artist: "新人アーティスト B",
      streams: 8500,
      earnings: 10200,
      royalty: 15,
      status: "配信中"
    },
    {
      id: 3,
      title: "Silent Waves",
      artist: "新人アーティスト C",
      streams: 12800,
      earnings: 15200,
      royalty: 15,
      status: "配信中"
    }
  ];

  const totalEarnings = royaltyBreakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">収益管理</h1>
        <p className="text-muted-foreground">印税分配と収益の詳細を確認しましょう</p>
      </div>

      {/* Important Notice */}
      <Card className="bg-gradient-subtle border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">重要なお知らせ</h3>
              <p className="text-sm text-muted-foreground">
                本アプリで制作されたすべての楽曲の権利は当社に帰属します。印税は配信収益に基づいて分配され、
                アーティスト、アレンジャー、エンジニアの貢献度に応じて適正に配分されます。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">総収益</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">¥{totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-accent">今月 +¥34,000</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">今月の収益</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">¥34,000</div>
            <p className="text-xs text-accent">先月比 +32%</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">総ストリーム数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">125.8K</div>
            <p className="text-xs text-accent">今月 +18.2K</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">平均印税率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">16.5%</div>
            <p className="text-xs text-muted-foreground">あなたのシェア</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Royalty Breakdown */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-accent" />
              印税分配の内訳
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {royaltyBreakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="font-medium">{item.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">¥{item.amount.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground ml-2">({item.percentage}%)</span>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between font-semibold">
                <span>合計</span>
                <span>¥{totalEarnings.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Earnings Chart */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              月別収益推移
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyEarnings.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium">{month.month}</p>
                    <p className="text-sm text-muted-foreground">{month.streams.toLocaleString()} streams</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">¥{month.amount.toLocaleString()}</p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {index > 0 ? 
                        `+${Math.round(((month.amount - monthlyEarnings[index-1].amount) / monthlyEarnings[index-1].amount) * 100)}%` 
                        : 'New'
                      }
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Track Details */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5 text-accent" />
            楽曲別収益詳細
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">すべて</TabsTrigger>
              <TabsTrigger value="streaming">配信中</TabsTrigger>
              <TabsTrigger value="pending">準備中</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {tracks.map((track) => (
                <div key={track.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="space-y-1">
                    <h4 className="font-semibold">{track.title}</h4>
                    <p className="text-sm text-muted-foreground">by {track.artist}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        印税 {track.royalty}%
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {track.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">¥{track.earnings.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{track.streams.toLocaleString()} streams</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">4月分</span>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="streaming">
              <div className="text-center py-8">
                <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">配信中の楽曲</h3>
                <p className="text-muted-foreground">現在配信されている楽曲の収益データです</p>
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">配信準備中</h3>
                <p className="text-muted-foreground">配信準備中の楽曲はまだ収益が発生していません</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Earnings;
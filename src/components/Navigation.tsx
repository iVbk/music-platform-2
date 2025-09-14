import { NavLink } from "react-router-dom";
import { Home, Upload, Users, TrendingUp, DollarSign, Music, MessageSquare, Search, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  userRole: string;
}

const Navigation = ({ userRole }: NavigationProps) => {
  const { signOut } = useAuth();
  
  const getNavItems = (role: string) => {
    const baseItems = [
      { to: "/", label: "ダッシュボード", icon: Home },
    ];

    if (role === 'artist') {
      return [
        ...baseItems,
        { to: "/upload", label: "マイページ", icon: Upload },
        { to: "/search", label: "検索", icon: Search },
        { to: "/rooms", label: "制作ルーム", icon: MessageSquare },
        { to: "/earnings", label: "収益管理", icon: DollarSign },
      ];
    }

    if (role === 'arranger' || role === 'engineer') {
      return [
        ...baseItems,
        { to: "/profile", label: "マイプロフィール", icon: Users },
        { to: "/search", label: "検索", icon: Search },
        { to: "/rooms", label: "制作ルーム", icon: MessageSquare },
        { to: "/earnings", label: "収益管理", icon: DollarSign },
      ];
    }

    if (role === 'admin') {
      return [
        ...baseItems,
        { to: "/demo-review", label: "デモ音源審査", icon: Music },
        { to: "/coordination", label: "コーディネート", icon: Users },
        { to: "/rooms", label: "全制作ルーム", icon: MessageSquare },
        { to: "/analytics", label: "アナリティクス", icon: TrendingUp },
        { to: "/settings", label: "設定", icon: Settings },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems(userRole);

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 z-50">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-neon bg-clip-text text-transparent">
          MusicSync
        </h1>
        <p className="text-sm text-muted-foreground mt-1">新人アーティスト発掘プロジェクト</p>
      </div>
      
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                  "hover:bg-secondary hover:shadow-card",
                  isActive
                    ? "bg-gradient-neon text-primary-foreground shadow-neon"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="absolute bottom-6 left-6 right-6 space-y-3">
        <Button
          onClick={signOut}
          variant="outline"
          size="sm"
          className="w-full flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          ログアウト
        </Button>
        <div className="p-4 rounded-lg bg-gradient-subtle border border-glass-border backdrop-blur-sm">
          <p className="text-sm text-muted-foreground mb-2">サポートが必要ですか？</p>
          <button className="text-sm text-accent hover:text-accent/80 transition-colors">
            お問い合わせ
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
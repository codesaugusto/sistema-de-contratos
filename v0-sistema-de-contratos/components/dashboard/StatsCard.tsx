import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: 'up' | 'down' | 'alert' | 'check';
  highlighted?: boolean;
}

export function StatsCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  highlighted = false,
}: StatsCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'check':
        return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className={`p-6 ${highlighted ? 'border-2 border-blue-500 bg-blue-50/30' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {getIcon()}
      </div>
    </Card>
  );
}

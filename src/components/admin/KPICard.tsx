'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: string
  bgColor: string
  trend?: {
    value: number
    period: string
  }
  subtitle?: string
  status?: 'healthy' | 'warning' | 'critical'
  className?: string
}

export function KPICard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  trend,
  subtitle,
  status = 'healthy',
  className
}: KPICardProps) {
  const getTrendIcon = () => {
    if (!trend) return null
    if (trend.value > 0) return <TrendingUp className="h-3 w-3 text-green-500" />
    if (trend.value < 0) return <TrendingDown className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-gray-500" />
  }

  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'critical': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-200", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              {status !== 'healthy' && (
                <div className={cn("w-2 h-2 rounded-full", getStatusColor().replace('text-', 'bg-'))} />
              )}
            </div>
            <p className="text-3xl font-bold mb-1">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center space-x-1 mt-2">
                {getTrendIcon()}
                <span className={cn(
                  "text-xs font-medium",
                  trend.value > 0 ? "text-green-500" : trend.value < 0 ? "text-red-500" : "text-gray-500"
                )}>
                  {Math.abs(trend.value)}% {trend.period}
                </span>
              </div>
            )}
          </div>
          <div className={cn("p-4 rounded-full", bgColor)}>
            <Icon className={cn("h-8 w-8", color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}












'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DataPoint {
  month: string
  [key: string]: string | number
}

interface SimpleBarChartProps {
  title: string
  data: DataPoint[]
  dataKey: string
  color?: string
}

export default function SimpleBarChart({
  title,
  data,
  dataKey,
  color = '#8884d8',
}: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map((item) => Number(item[dataKey]))) * 1.1

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <div className="flex h-full flex-col">
            <div className="flex justify-between px-4 text-xs text-muted-foreground">
              {data.map((item, i) => (
                <div key={i} className="text-center">
                  {item.month}
                </div>
              ))}
            </div>
            <div className="mt-auto flex h-[350px] items-end justify-between px-4">
              {data.map((item, i) => {
                const value = Number(item[dataKey])
                const heightPercent = (value / maxValue) * 100

                return (
                  <div key={i} className="group relative flex w-full flex-col items-center">
                    <div
                      className="w-full max-w-[50px] rounded-t-sm transition-all group-hover:opacity-80"
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: color,
                        minWidth: '20px',
                      }}
                    />
                    <div className="absolute -top-8 hidden rounded-md bg-background p-1 text-xs shadow-md group-hover:block">
                      {dataKey === 'revenue'
                        ? `$${value.toLocaleString()}`
                        : value.toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

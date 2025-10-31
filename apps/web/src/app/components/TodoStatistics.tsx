"use client";

import type { TodoStatistics as TodoStatisticsType } from "@monorepo/types";
import { Card, CardContent, CardHeader, CardTitle } from "@monorepo/ui/components/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useRef } from "react";

interface TodoStatisticsProps {
  statistics: TodoStatisticsType;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function TodoStatistics({ statistics }: TodoStatisticsProps) {
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    // After first render, mark that initial mount is complete
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, []);
  const completionData = [
    { name: "Completed", value: statistics.completed },
    { name: "Pending", value: statistics.pending },
  ];

  const labelData = statistics.byLabel.map((item) => ({
    label: item.label,
    completed: item.completed,
    pending: item.pending,
    total: item.total,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Todos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {statistics.completed}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">
              {statistics.pending}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Completion Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={isInitialMount.current}
                  animationDuration={300}
                >
                  {completionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? COLORS[1] : COLORS[0]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {labelData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Todos by Label</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={labelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="completed" 
                    fill="#00C49F" 
                    name="Completed"
                    isAnimationActive={isInitialMount.current}
                    animationDuration={300}
                  />
                  <Bar 
                    dataKey="pending" 
                    fill="#0088FE" 
                    name="Pending"
                    isAnimationActive={isInitialMount.current}
                    animationDuration={300}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {labelData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Label Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {labelData.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <span className="font-medium">{item.label}</span>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Total: {item.total}</span>
                    <span className="text-green-600">
                      Completed: {item.completed}
                    </span>
                    <span className="text-orange-600">
                      Pending: {item.pending}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


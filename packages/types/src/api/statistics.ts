export interface TodoStatistics {
  total: number;
  completed: number;
  pending: number;
  byLabel: Array<{
    label: string;
    total: number;
    completed: number;
    pending: number;
  }>;
}

export type GetStatisticsResponse = TodoStatistics;


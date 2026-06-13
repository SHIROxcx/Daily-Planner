export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  color: string; // Hex color code
  completed: boolean;
  date: string; // YYYY-MM-DD format
  isImportant?: boolean; // Optional flag for important/priority events
}

export interface TimeBlock {
  hour: number;
  events: Event[];
}

export type ViewType = "day" | "week" | "month" | "year";

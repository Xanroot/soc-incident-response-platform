export type TimelineEvent = {
  time: string;
  message: string;
};

export type Incident = {
  id: string;
  alertId: string;
  title: string;
  severity: string;
  status: "Open" | "In Progress" | "Closed";
  createdAt: string;
  notes?: string;
  timeline?: TimelineEvent[];

  // 🧑‍💻 Analyst assignment
  assignedAnalyst?: string;
};

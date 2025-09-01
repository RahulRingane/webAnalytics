// /types.ts
export type UpDownUnknown = "up" | "down" | "unknown";

export type ProjectCheck = {
  id: string;
  projectId: string;
  status: UpDownUnknown;
  responseTime: number | null;
  statusCode: number | null;
  timestamp: Date | string;
};

export type Project = {
  id: string;
  name: string;
  url: string;        // full URL (https://example.com)
  domain?: string;    // optional/plain domain if you keep it
  status?: UpDownUnknown;
  lastChecked: string | null;
  checks: ProjectCheck[];
};

// WebSocket message we expect from the worker
export type WsUpdate = {
  projectId: string;
  checkId: string;
  status: UpDownUnknown;
  timestamp: string;             // ISO string
  responseTime: number | null;
  statusCode: number | null;
};

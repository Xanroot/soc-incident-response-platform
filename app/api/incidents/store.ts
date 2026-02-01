import type { Incident } from "@/types/incident";

const globalForIncidents = globalThis as unknown as {
  incidents?: Incident[];
};

export const incidents =
  globalForIncidents.incidents ?? [];

if (!globalForIncidents.incidents) {
  globalForIncidents.incidents = incidents;
}

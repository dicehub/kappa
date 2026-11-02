export interface WorkspaceNotification {
  id: string;
  namespace: string;
  title: string;
  description: string;
  time: string;
  page: string;
  read: boolean;
}

export function createWorkspaceNotifications(namespaces: string[]): WorkspaceNotification[] {
  const samples = [
    { key: "mesh", title: "Mesh report updated", description: "Maya updated the rotor mesh quality report.", time: "5 min ago", page: "Simulation runs" },
    { key: "run", title: "Reference run completed", description: "Alex completed the inlet reference run.", time: "18 min ago", page: "Simulation runs" },
    { key: "review", title: "Review requested", description: "Sam requested a review of the heat exchanger results.", time: "1 h ago", page: "Design reviews" },
  ];
  return namespaces.flatMap(namespace => samples.map(({ key, ...item }) => ({ ...item, namespace, id: `${namespace}:${key}`, read: false })));
}

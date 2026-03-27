import { connection } from "next/server";

interface GithubDeployment {
  id: number;
  environment: string;
  created_at: string;
}

interface GithubDeploymentStatus {
  state: "success" | "failure" | "error" | "pending" | "in_progress" | "queued" | "inactive" | "waiting";
  created_at: string;
  target_url?: string;
}

const STATE_UI: Record<string, { label: string; classes: string }> = {
  success:     { label: "Desplegado",   classes: "bg-green-50 text-green-700 border-green-200" },
  failure:     { label: "Falló",        classes: "bg-red-50 text-red-700 border-red-200" },
  error:       { label: "Error",        classes: "bg-red-50 text-red-700 border-red-200" },
  in_progress: { label: "Desplegando…", classes: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  pending:     { label: "En cola…",     classes: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  queued:      { label: "En cola…",     classes: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  waiting:     { label: "Esperando…",   classes: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  inactive:    { label: "Inactivo",     classes: "bg-gray-50 text-gray-500 border-gray-200" },
};

async function fetchDeployStatus(): Promise<{ state: string; url?: string; date: string } | null> {
  try {
    const deploymentsRes = await fetch(
      "https://api.github.com/repos/Jhont3/mantra-animal/deployments?environment=Production&per_page=1",
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 60 },
      }
    );
    if (!deploymentsRes.ok) return null;
    const deployments: GithubDeployment[] = await deploymentsRes.json();
    if (!deployments.length) return null;

    const statusRes = await fetch(
      `https://api.github.com/repos/Jhont3/mantra-animal/deployments/${deployments[0].id}/statuses?per_page=1`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 60 },
      }
    );
    if (!statusRes.ok) return null;
    const statuses: GithubDeploymentStatus[] = await statusRes.json();
    if (!statuses.length) return null;

    return {
      state: statuses[0].state,
      url: statuses[0].target_url,
      date: deployments[0].created_at,
    };
  } catch {
    return null;
  }
}

export default async function DeployStatus() {
  await connection();
  const deploy = await fetchDeployStatus();
  if (!deploy) return null;

  const ui = STATE_UI[deploy.state] ?? STATE_UI.inactive;
  const date = new Date(deploy.date).toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <a
      href={deploy.url ?? "https://vercel.com/jhont3s-projects/mantra-animal"}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 text-xs font-medium border rounded-lg px-3 py-1.5 transition-opacity hover:opacity-80 ${ui.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${deploy.state === "success" ? "bg-green-500" : deploy.state.includes("progress") || deploy.state === "pending" ? "bg-yellow-400 animate-pulse" : "bg-red-500"}`} />
      Vercel: {ui.label} · {date}
    </a>
  );
}

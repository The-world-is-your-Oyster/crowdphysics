import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/datasets",
    description: "List all available datasets with filtering options.",
    params: [
      { name: "category", type: "string", description: "Filter by category (e.g., kitchen, cleaning)" },
      { name: "format", type: "string", description: "Filter by format (rlds, lerobot, hdf5)" },
      { name: "limit", type: "integer", description: "Number of results per page (default: 20)" },
      { name: "offset", type: "integer", description: "Pagination offset" },
    ],
    example: `curl -X GET "https://api.crowdphysics.com/v1/datasets?category=kitchen&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    response: `{
  "data": [
    {
      "id": "kitchen-manipulation",
      "title": "Kitchen Manipulation",
      "category": "kitchen",
      "hours": 2500,
      "task_count": 5,
      "price_per_hour": 99,
      "formats": ["rlds", "lerobot", "hdf5"]
    }
  ],
  "total": 6,
  "limit": 10,
  "offset": 0
}`,
  },
  {
    method: "GET",
    path: "/api/v1/datasets/{id}",
    description: "Get detailed information about a specific dataset.",
    params: [
      { name: "id", type: "string", description: "Dataset identifier (path parameter)" },
    ],
    example: `curl -X GET "https://api.crowdphysics.com/v1/datasets/kitchen-manipulation" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    response: `{
  "id": "kitchen-manipulation",
  "title": "Kitchen Manipulation",
  "category": "kitchen",
  "description": "Comprehensive kitchen task recordings...",
  "hours": 2500,
  "task_count": 5,
  "tasks": ["Pouring liquids", "Stirring & mixing", ...],
  "annotations": {
    "hand_pose": true,
    "hand_mesh": true,
    "object_detection": true,
    "grasp_classification": true,
    "action_segmentation": true,
    "scene_description": true
  },
  "stats": {
    "total_recordings": 45000,
    "unique_environments": 3200,
    "avg_duration_sec": 198,
    "contributors": 1800
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/datasets/{id}/download",
    description: "Download dataset recordings in the specified format. Returns a signed URL.",
    params: [
      { name: "id", type: "string", description: "Dataset identifier (path parameter)" },
      { name: "format", type: "string", description: "Output format: rlds, lerobot, hdf5 (required)" },
      { name: "task", type: "string", description: "Filter by specific task type" },
      { name: "hours", type: "integer", description: "Number of hours to download" },
    ],
    example: `curl -X GET "https://api.crowdphysics.com/v1/datasets/kitchen-manipulation/download?format=lerobot&hours=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    response: `{
  "download_url": "https://data.crowdphysics.com/signed/abc123...",
  "expires_at": "2026-03-07T00:00:00Z",
  "format": "lerobot",
  "size_gb": 4.2,
  "recordings": 180,
  "hours": 10
}`,
  },
  {
    method: "POST",
    path: "/api/v1/campaigns",
    description: "Create a custom data collection campaign (Enterprise only).",
    params: [
      { name: "name", type: "string", description: "Campaign name" },
      { name: "task_description", type: "string", description: "Description of the task to collect" },
      { name: "target_hours", type: "integer", description: "Target hours of data" },
      { name: "environment", type: "string", description: "Target environment type" },
    ],
    example: `curl -X POST "https://api.crowdphysics.com/v1/campaigns" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Dishwasher Loading",
    "task_description": "Loading and unloading a dishwasher",
    "target_hours": 500,
    "environment": "kitchen"
  }'`,
    response: `{
  "campaign_id": "camp_dw_001",
  "name": "Dishwasher Loading",
  "status": "pending_review",
  "estimated_completion": "2026-04-15",
  "price_estimate": {
    "per_hour": 149,
    "total": 74500
  }
}`,
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  POST: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

export default function ApiDocsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
        <p className="mt-3 text-muted-foreground">
          Programmatic access to the CrowdPhysics data platform.
        </p>

        <Separator className="my-8" />

        {/* Getting Started */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Getting Started</h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              All API requests require authentication via an API key. Include your
              key in the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">Authorization</code> header.
            </p>
            <Card>
              <CardContent className="p-4">
                <pre className="overflow-x-auto text-xs">
                  <code>{`Base URL: https://api.crowdphysics.com/v1

Headers:
  Authorization: Bearer YOUR_API_KEY
  Content-Type: application/json`}</code>
                </pre>
              </CardContent>
            </Card>
            <p>
              To get an API key, sign up for a plan on the{" "}
              <a href="/pricing" className="font-medium text-primary underline">
                pricing page
              </a>{" "}
              and generate a key from your dashboard.
            </p>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-semibold">Endpoints</h2>
          <div className="space-y-8">
            {endpoints.map((ep) => (
              <Card key={ep.path + ep.method} id={ep.path.replace(/[/{}/]/g, "-")}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`font-mono text-xs ${methodColors[ep.method]}`}
                      variant="secondary"
                    >
                      {ep.method}
                    </Badge>
                    <CardTitle className="font-mono text-base font-medium">
                      {ep.path}
                    </CardTitle>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {ep.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Parameters */}
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Parameters</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="pb-2 pr-4 font-medium text-muted-foreground">
                              Name
                            </th>
                            <th className="pb-2 pr-4 font-medium text-muted-foreground">
                              Type
                            </th>
                            <th className="pb-2 font-medium text-muted-foreground">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {ep.params.map((p) => (
                            <tr key={p.name} className="border-b last:border-0">
                              <td className="py-2 pr-4 font-mono text-xs">
                                {p.name}
                              </td>
                              <td className="py-2 pr-4 text-muted-foreground">
                                {p.type}
                              </td>
                              <td className="py-2 text-muted-foreground">
                                {p.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Example */}
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Example Request</h4>
                    <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs leading-relaxed">
                      <code>{ep.example}</code>
                    </pre>
                  </div>

                  {/* Response */}
                  <div>
                    <h4 className="mb-2 text-sm font-medium">
                      Example Response
                    </h4>
                    <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs leading-relaxed">
                      <code>{ep.response}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Python SDK */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Python SDK</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Install the official Python client for a streamlined developer experience.
          </p>
          <Card>
            <CardContent className="p-4">
              <pre className="overflow-x-auto text-xs leading-relaxed">
                <code>{`pip install crowdphysics`}</code>
              </pre>
            </CardContent>
          </Card>
          <div className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto text-xs leading-relaxed">
                  <code>{`from crowdphysics import CrowdPhysicsClient

# Initialize the client
client = CrowdPhysicsClient(api_key="your_key")

# List available datasets
datasets = client.datasets.list(category="kitchen")
for ds in datasets:
    print(f"{ds.title}: {ds.hours} hours")

# Get a specific dataset
dataset = client.datasets.get("kitchen-manipulation")
print(dataset.stats)

# Download data in LeRobot format
dataset.download(
    format="lerobot",
    path="./data/",
    hours=50,
    task="pouring_liquid"
)

# Create a custom campaign (Enterprise)
campaign = client.campaigns.create(
    name="Dishwasher Loading",
    task_description="Loading and unloading a dishwasher",
    target_hours=500,
    environment="kitchen"
)
print(f"Campaign {campaign.id}: {campaign.status}")`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Rate Limits */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Rate Limits</h2>
          <Card>
            <CardContent className="py-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">
                        Plan
                      </th>
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">
                        Requests/min
                      </th>
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">
                        Downloads/day
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground">
                        Concurrent Downloads
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-medium">Starter</td>
                      <td className="py-2 pr-4">60</td>
                      <td className="py-2 pr-4">10</td>
                      <td className="py-2">2</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-medium">Pro</td>
                      <td className="py-2 pr-4">300</td>
                      <td className="py-2 pr-4">100</td>
                      <td className="py-2">10</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Enterprise</td>
                      <td className="py-2 pr-4">Custom</td>
                      <td className="py-2 pr-4">Unlimited</td>
                      <td className="py-2">Custom</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <p className="mt-3 text-sm text-muted-foreground">
            Rate limits are applied per API key. If you exceed your rate limit,
            you will receive a <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">429 Too Many Requests</code> response.
            Contact us if you need higher limits.
          </p>
        </section>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Hand,
  Box,
  Scan,
  Grip,
  Layers,
  FileText,
  Check,
  Clock,
  MapPin,
  Timer,
  Users,
  ArrowLeft,
} from "lucide-react";
import { datasets, getDataset } from "@/lib/data";

export function generateStaticParams() {
  return datasets.map((ds) => ({ id: ds.id }));
}

const annotationItems = [
  {
    key: "handPose" as const,
    icon: Hand,
    label: "Hand Pose",
    detail: "21 keypoints @ 30fps",
  },
  {
    key: "handMesh" as const,
    icon: Box,
    label: "3D Hand Mesh",
    detail: "MANO parameters",
  },
  {
    key: "objectDetection" as const,
    icon: Scan,
    label: "Object Detection",
    detail: "YOLO bbox tracks",
  },
  {
    key: "graspClassification" as const,
    icon: Grip,
    label: "Grasp Classification",
    detail: "6 types",
  },
  {
    key: "actionSegmentation" as const,
    icon: Layers,
    label: "Action Segmentation",
    detail: "Temporal phases",
  },
  {
    key: "sceneDescription" as const,
    icon: FileText,
    label: "Scene Description",
    detail: "VLM-generated",
  },
];

export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dataset = getDataset(id);

  if (!dataset) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/datasets"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Datasets
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl">{dataset.categoryEmoji}</span>
          <h1 className="text-3xl font-bold tracking-tight">{dataset.title}</h1>
          <Badge variant="secondary">{dataset.category}</Badge>
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            {dataset.hours.toLocaleString()} hours
          </Badge>
        </div>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          {dataset.description}
        </p>
      </div>

      {/* What's Included */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">What&apos;s Included</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {annotationItems.map((item) => (
            <Card key={item.key}>
              <CardContent className="flex items-center gap-3 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    {dataset.annotations[item.key] && (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.detail}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tasks */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Task Types</h2>
        <div className="flex flex-wrap gap-2">
          {dataset.tasks.map((task) => (
            <Badge key={task} variant="outline" className="px-3 py-1">
              {task}
            </Badge>
          ))}
        </div>
      </section>

      {/* Sample Data Preview */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Sample Data Schema</h2>
        <Card>
          <CardContent className="p-0">
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed">
              <code>{dataset.sampleSchema}</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      {/* Stats */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Dataset Statistics</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              icon: Layers,
              label: "Total Recordings",
              value: dataset.totalRecordings.toLocaleString(),
            },
            {
              icon: MapPin,
              label: "Unique Environments",
              value: dataset.uniqueEnvironments.toLocaleString(),
            },
            {
              icon: Timer,
              label: "Avg Duration",
              value: dataset.avgDuration,
            },
            {
              icon: Users,
              label: "Contributors",
              value: dataset.contributors.toLocaleString(),
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="py-4 text-center">
                <stat.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Pricing</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Volume Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-muted-foreground">
                      Hours
                    </th>
                    <th className="pb-2 font-medium text-muted-foreground">
                      Discount
                    </th>
                    <th className="pb-2 font-medium text-muted-foreground">
                      Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataset.volumeDiscounts.map((tier) => (
                    <tr key={tier.hours} className="border-b last:border-0">
                      <td className="py-2">{tier.hours}</td>
                      <td className="py-2">{tier.discount}</td>
                      <td className="py-2 font-medium">{tier.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-8" />

      {/* CTA */}
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h3 className="text-lg font-semibold">
            Ready to use {dataset.title} data?
          </h3>
          <p className="text-sm text-muted-foreground">
            Request access and start training your robot today.
          </p>
        </div>
        <Button size="lg" asChild>
          <a href={`mailto:data@crowdphysics.com?subject=Access Request: ${dataset.title}`}>
            Request Access
          </a>
        </Button>
      </div>
    </div>
  );
}

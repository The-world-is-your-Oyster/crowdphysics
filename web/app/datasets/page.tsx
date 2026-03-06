"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, ListChecks, ArrowRight } from "lucide-react";
import { datasets, categories, dataTypes, formats } from "@/lib/data";

export default function DatasetsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState("All");

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleDataType = (id: string) => {
    setSelectedDataTypes((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const filteredDatasets = datasets.filter((ds) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(ds.category)) {
      return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dataset Catalog</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our collection of real-world manipulation data.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full shrink-0 lg:w-64">
          <div className="rounded-lg border bg-card p-5">
            <h3 className="text-sm font-semibold">Category</h3>
            <div className="mt-3 space-y-2">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>

            <Separator className="my-4" />

            <h3 className="text-sm font-semibold">Data Type</h3>
            <div className="mt-3 space-y-2">
              {dataTypes.map((dt) => (
                <label
                  key={dt.id}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedDataTypes.includes(dt.id)}
                    onChange={() => toggleDataType(dt.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>{dt.name}</span>
                </label>
              ))}
            </div>

            <Separator className="my-4" />

            <h3 className="text-sm font-semibold">Format</h3>
            <div className="mt-3 space-y-2">
              {formats.map((fmt) => (
                <label
                  key={fmt}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    name="format"
                    checked={selectedFormat === fmt}
                    onChange={() => setSelectedFormat(fmt)}
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>{fmt}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Dataset Grid */}
        <div className="flex-1">
          <div className="mb-4 text-sm text-muted-foreground">
            {filteredDatasets.length} dataset{filteredDatasets.length !== 1 ? "s" : ""} found
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredDatasets.map((ds) => (
              <Card key={ds.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{ds.categoryEmoji}</span>
                      <CardTitle className="text-lg">{ds.title}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {ds.priceRange}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {ds.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {ds.hours.toLocaleString()} hrs
                    </span>
                    <span className="flex items-center gap-1">
                      <ListChecks className="h-3.5 w-3.5" />
                      {ds.taskCount} tasks
                    </span>
                  </div>
                  <div className="mt-auto pt-4">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/datasets/${ds.id}`}>
                        View Details <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

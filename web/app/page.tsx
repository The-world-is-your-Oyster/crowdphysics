import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  BrainCircuit,
  Bot,
  DollarSign,
  Globe,
  RefreshCw,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { categories } from "@/lib/data";

const stats = [
  { label: "Hours of Data", value: "10,000+" },
  { label: "Contributors", value: "5,000+" },
  { label: "Task Types", value: "20+" },
  { label: "Categories", value: "6" },
];

const howItWorks = [
  {
    icon: Smartphone,
    title: "Contributors Record",
    description:
      "Thousands of people record everyday tasks with their phones in real home environments.",
  },
  {
    icon: BrainCircuit,
    title: "AI Annotates",
    description:
      "Our pipeline extracts hand poses, object interactions, and action segments automatically.",
  },
  {
    icon: Bot,
    title: "You Train",
    description:
      "Download structured data in RLDS/LeRobot format and train your robot on real-world demonstrations.",
  },
];

const valueProps = [
  {
    icon: DollarSign,
    title: "10x Cheaper",
    description: "Phone-based collection vs $200/hr teleoperation rigs.",
  },
  {
    icon: Globe,
    title: "1000x More Diverse",
    description: "Real homes, not lab environments. True distribution coverage.",
  },
  {
    icon: RefreshCw,
    title: "Always Fresh",
    description: "Continuous collection from our contributor network. Never stale.",
  },
  {
    icon: Cpu,
    title: "Robot-Ready",
    description: "RLDS, LeRobot v3, HDF5 formats out of the box.",
  },
];

const categoryTaskCounts: Record<string, number> = {
  kitchen: 5,
  cleaning: 4,
  organization: 3,
  assembly: 3,
  "personal-care": 3,
  office: 2,
};

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Now in Public Beta
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Real-World Physical{" "}
              <span className="text-primary">Intelligence Data</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Crowdsourced manipulation data from thousands of real homes.
              Phone-captured, AI-annotated, robot-ready.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/datasets">Browse Datasets</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">Request Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-primary sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-3 text-muted-foreground">
              From phone capture to robot training in three steps.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {howItWorks.map((step, i) => (
              <Card key={step.title} className="relative">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Categories */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Data Categories
            </h2>
            <p className="mt-3 text-muted-foreground">
              Comprehensive coverage of everyday manipulation tasks.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/datasets?category=${cat.id}`}>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-4 py-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                      {cat.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {categoryTaskCounts[cat.id]} task types
                      </p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why CrowdPhysics */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Why CrowdPhysics
            </h2>
            <p className="mt-3 text-muted-foreground">
              The unfair advantage for robotics companies.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {valueProps.map((prop) => (
              <div key={prop.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <prop.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{prop.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {prop.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="border-y bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Trusted by leading robotics companies
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {["RoboCo", "ArmDynamics", "GraspAI", "HomeBot", "DexterLab"].map(
              (name) => (
                <div
                  key={name}
                  className="text-lg font-semibold text-muted-foreground/50"
                >
                  {name}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to accelerate your robot training?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Get access to the largest crowdsourced physical intelligence
              dataset. Start training better robots today.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/datasets">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

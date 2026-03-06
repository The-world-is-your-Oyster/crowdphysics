import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: "$999",
    period: "/mo",
    description: "For research teams exploring physical intelligence data.",
    features: [
      "100 hours of data per month",
      "Basic annotations (hand pose + object detection)",
      "5 task types",
      "RLDS and HDF5 formats",
      "Email support",
      "Standard API access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$4,999",
    period: "/mo",
    description: "For teams building production robotics systems.",
    features: [
      "1,000 hours of data per month",
      "Full annotations (all 6 data layers)",
      "All task types",
      "RLDS, LeRobot v3, and HDF5 formats",
      "Priority API access",
      "Priority email and Slack support",
      "Custom data filtering",
      "Monthly usage reports",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with custom data requirements.",
    features: [
      "Unlimited data access",
      "Custom data collection campaigns",
      "Dedicated account manager",
      "99.9% SLA guarantee",
      "On-premise deployment option",
      "Custom annotation pipelines",
      "Priority data collection",
      "Phone and video support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    question: "What data formats do you support?",
    answer:
      "We support RLDS (used by Google DeepMind), LeRobot v3 (Hugging Face format), and HDF5 for maximum compatibility with popular robotics frameworks. Custom format exports are available on Enterprise plans.",
  },
  {
    question: "How is the data collected?",
    answer:
      "Contributors record everyday tasks using their smartphones. Our app guides them through specific tasks with real-time quality checks. All recordings are then processed through our AI annotation pipeline that extracts hand poses, object interactions, and action segments.",
  },
  {
    question: "Can I request specific types of data?",
    answer:
      "Yes! Enterprise customers can create custom data collection campaigns targeting specific tasks, environments, or objects. Pro customers can use our filtering API to select exactly the data subsets they need.",
  },
  {
    question: "How do you ensure data quality?",
    answer:
      "We use a multi-stage quality pipeline: real-time recording validation, automated annotation quality scores, statistical outlier detection, and periodic human review. Average annotation confidence is above 90%.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "We offer a free sample dataset with 10 hours of kitchen manipulation data so you can evaluate our data quality and format compatibility before committing to a plan.",
  },
  {
    question: "How frequently is new data added?",
    answer:
      "Our contributor network is continuously active. New recordings are processed and added to the platform daily. Pro and Enterprise customers get access to fresh data within 24 hours of processing.",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that fits your robotics data needs. All plans include
          API access and standard data formats.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`relative flex flex-col ${
              tier.popular ? "border-primary shadow-lg" : ""
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground">{tier.period}</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button
                  className="w-full"
                  variant={tier.popular ? "default" : "outline"}
                  asChild
                >
                  <Link
                    href={
                      tier.name === "Enterprise"
                        ? "mailto:sales@crowdphysics.com?subject=Enterprise Inquiry"
                        : "/datasets"
                    }
                  >
                    {tier.cta}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-16" />

      {/* FAQ */}
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="text-sm font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

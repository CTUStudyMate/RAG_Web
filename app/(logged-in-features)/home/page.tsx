"use client";

import Link from "next/link";
import {
  MessageSquare,
  FileUp,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="w-full max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back 👋
          </h1>

          <p className="mt-3 text-muted-foreground text-lg">
            What would you like to do today?
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/chat"
            className="group rounded-2xl border bg-background p-6 transition-all hover:border-primary hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>

            <h2 className="text-xl font-semibold">Chat Assistant</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Ask questions about your study materials and receive AI-powered
              assistance.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
              Open Chat
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/review"
            className="group rounded-2xl border bg-background p-6 transition-all hover:border-primary hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ClipboardCheck className="h-6 w-6 text-primary" />
            </div>

            <h2 className="text-xl font-semibold">Review Exercises</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Practice with AI-generated questions and review your answers.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
              Start Review
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/upload"
            className="group rounded-2xl border bg-background p-6 transition-all hover:border-primary hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <FileUp className="h-6 w-6 text-primary" />
            </div>

            <h2 className="text-xl font-semibold">Upload Documents</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Upload lecture slides, notes or PDFs to expand your knowledge
              base.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
              Upload Files
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
    </div>
    </div>
  );
}
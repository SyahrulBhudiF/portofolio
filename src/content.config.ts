import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projectCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    type: z.string(),
    role: z.string().nullable().optional(),
    hasImage: z.boolean().default(true),
    date: z.coerce.date(),
    description: z.string(),
    demo: z.url().nullable().default(null),
    sourceModel: z.url().nullable().default(null),
    sourceClient: z.url().nullable().default(null),
    sourceServer: z.url().nullable().default(null),
    stack: z.array(
      z.object({
        name: z.string(),
        url: z.url(),
      }),
    ),
    contributors: z
      .array(
        z.object({
          role: z.string(),
          name: z.string(),
          link: z.url().nullable().default(null),
        }),
      )
      .optional(),
  }),
});

const contributionCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/contributions" }),
  schema: z.object({
    title: z.string(),
    repository: z.url(),
    date: z.coerce.date(),
    description: z.string(),
    highlights: z.array(z.string()).default([]),
    pullRequest: z.url().nullable().optional(),
    issue: z.url().nullable().optional(),
    commit: z.url().nullable().optional(),
  }),
});

const experienceCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/experiences" }),
  schema: z.object({
    company: z.string(),
    position: z.string(),
    duration: z.string(),
    location: z.string(),
    order: z.number().default(0),
    description: z.array(z.string()),
    technologies: z.array(z.string()),
    tags: z.array(z.string()).default([]),
  }),
});

const educationCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/education" }),
  schema: z.object({
    institution: z.string(),
    degree: z.string(),
    duration: z.string(),
    location: z.string(),
    order: z.number().default(0),
    description: z.array(z.string()),
    achievements: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

const techstackCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/techstack" }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(0),
    items: z.array(
      z.object({
        name: z.string(),
        url: z.url(),
      }),
    ),
  }),
});

export const collections = {
  projects: projectCollection,
  contributions: contributionCollection,
  experiences: experienceCollection,
  education: educationCollection,
  techstack: techstackCollection,
};

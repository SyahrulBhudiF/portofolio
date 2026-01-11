import { defineCollection, z } from "astro:content";

const projectCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    type: z.string(),
    role: z.string().nullable().optional(),
    hasImage: z.boolean().default(true),
    date: z.coerce.date(),
    description: z.string(),
    demo: z.string().url().nullable().default(null),
    sourceModel: z.string().url().nullable().default(null),
    sourceClient: z.string().url().nullable().default(null),
    sourceServer: z.string().url().nullable().default(null),
    stack: z.array(z.string()),
    contributors: z
      .array(
        z.object({
          role: z.string(),
          name: z.string(),
          link: z.string().url().nullable().default(null),
        }),
      )
      .optional(),
  }),
});

const experienceCollection = defineCollection({
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
  schema: z.object({
    title: z.string(),
    order: z.number().default(0),
    items: z.array(z.string()),
  }),
});

export const collections = {
  projects: projectCollection,
  experiences: experienceCollection,
  education: educationCollection,
  techstack: techstackCollection,
};

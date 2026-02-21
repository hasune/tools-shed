import { MetadataRoute } from "next";
import { tools, categories } from "@/lib/tools";

const BASE_URL = "https://tools-shed.com";
const LOCALES = ["en", "ja", "ko", "zh-CN", "es"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Root redirect (points to /en)
  entries.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  });

  for (const locale of LOCALES) {
    // Home per locale
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: locale === "en" ? 1 : 0.9,
    });

    // About
    entries.push({
      url: `${BASE_URL}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    });

    // Privacy
    entries.push({
      url: `${BASE_URL}/${locale}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    });

    // Category pages
    for (const category of categories) {
      entries.push({
        url: `${BASE_URL}/${locale}/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    // Tool pages
    for (const tool of tools) {
      entries.push({
        url: `${BASE_URL}/${locale}/${tool.categorySlug}/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}

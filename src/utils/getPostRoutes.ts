import { getCollection } from "astro:content";
import { getSortedPosts } from "./getSortedPosts";
import { getPostSlug, getPostUrl } from "./getPostPaths";
import type { Language, Translations } from "@/i18n";

export async function getPostRoutes(lang: Language) {
  const posts = getSortedPosts(await getCollection("posts"));
  return posts
    .filter(post => post.data.lang === lang)
    .map(post => {
      const slug = getPostSlug(post.id, post.filePath);
      const translations: Translations = {};
      for (const translation of posts) {
        if (getPostSlug(translation.id, translation.filePath) === slug) {
          translations[translation.data.lang] = getPostUrl(
            translation.id,
            translation.filePath,
            translation.data.lang
          );
        }
      }
      return { params: { slug: slug.slice(1) }, props: { post, translations } };
    });
}

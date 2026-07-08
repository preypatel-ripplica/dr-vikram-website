import kidneyStones from "@/data/blogs/kidney-stones.json";

export type BlogData = typeof kidneyStones;

const blogs = [kidneyStones] satisfies BlogData[];

export function getAllBlogs() {
  return blogs;
}

export function getBlogBySlug(slug: string) {
  return blogs.find((blog) => blog.slug === slug) ?? null;
}

import { getAllBlogs } from "@/lib/blogs";
import { getAllTreatments } from "@/lib/treatments";

export const STATIC_ROUTES = [
  "/",
  "/about-us",
  "/blogs",
  "/contact-us",
  "/international-patient-support",
  "/testimonials",
  "/treatment-journey",
  "/video-gallery",
] as const;

export async function getAllSiteRoutes() {
  const [treatments, blogs] = await Promise.all([getAllTreatments(), getAllBlogs()]);

  return [
    ...STATIC_ROUTES,
    ...treatments.map((treatment) => `/treatments/${treatment.slug}`),
    ...blogs.map((blog) => `/blogs/${blog.slug}`),
  ];
}

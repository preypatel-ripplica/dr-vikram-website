import { getAllBlogs } from "@/lib/blogs";
import { getAllTreatments } from "@/lib/treatments";

export const STATIC_ROUTES = [
  "/",
  "/blogs",
  "/contact-us",
  "/international-patient-support",
  "/testimonials",
  "/treatment-journey",
  "/video-gallery",
] as const;

export function getAllSiteRoutes() {
  return [
    ...STATIC_ROUTES,
    ...getAllTreatments().map((treatment) => `/treatments/${treatment.slug}`),
    ...getAllBlogs().map((blog) => `/blogs/${blog.slug}`),
  ];
}

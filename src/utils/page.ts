export type Page =
  | "about"
  | "blog"
  | "projects"
  | "resume"
  | "contact"
  | "home";

export function getCurrentPage(url: URL): Page {
  if (url.pathname.startsWith("/about")) {
    return "about";
  }

  if (url.pathname.startsWith("/blog")) {
    return "blog";
  }

  if (url.pathname.startsWith("/projects")) {
    return "projects";
  }

  if (url.pathname.startsWith("/resume")) {
    return "resume";
  }

  if (url.pathname.startsWith("/contact")) {
    return "contact";
  }

  return "home";
}

export const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "http://localhost:3000";

export const siteBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const withBasePath = (path: string) => {
  if (!path.startsWith("/")) {
    return path;
  }

  return `${siteBasePath}${path}`;
};

export const absoluteUrl = (path = "/") =>
  new URL(withBasePath(path), siteOrigin).toString();

export const siteUrl = absoluteUrl("/");

const normalizeList = (value) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeCookieSameSite = (value) => {
  const normalized = (value || "lax").toLowerCase();
  return ["lax", "strict", "none"].includes(normalized) ? normalized : "lax";
};

const required = (name, value) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";
const clientUrls = normalizeList(
  process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:3000"
);
const cookieSameSite = normalizeCookieSameSite(process.env.COOKIE_SAME_SITE);
const cookieSecure =
  process.env.COOKIE_SECURE === "true" || (isProduction && cookieSameSite === "none");

if (isProduction && cookieSameSite === "none" && !cookieSecure) {
  throw new Error("COOKIE_SAME_SITE=none requires COOKIE_SECURE=true");
}

module.exports = {
  port: Number(process.env.PORT || 5000),
  nodeEnv,
  isProduction,
  mongoUri: required("MONGO_URI", process.env.MONGO_URI),
  jwtSecret: required("JWT_SECRET", process.env.JWT_SECRET),
  clientUrls,
  cookieName: process.env.COOKIE_NAME || "token",
  cookieSameSite,
  cookieSecure,
};

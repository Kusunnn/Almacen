import "dotenv/config";

console.log(
  "DATABASE_URL =",
  (process.env.DATABASE_URL || "")
    .replace(/:\/\/([^:]+):([^@]+)@/, "://$1:****@")
);

process.exit(0);
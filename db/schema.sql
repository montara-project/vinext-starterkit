-- Vinext Starterkit — D1 Schema
-- Run via: wrangler d1 execute vinext-db --file=db/schema.sql

-- ============================================================
-- better-auth tables (required by drizzle adapter w/ provider sqlite)
-- ============================================================

CREATE TABLE IF NOT EXISTS "user" (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  emailVerified INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "session" (
  id TEXT PRIMARY KEY,
  expiresAt INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  ipAddress TEXT,
  userAgent TEXT,
  userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
  id TEXT PRIMARY KEY,
  accountId TEXT NOT NULL,
  providerId TEXT NOT NULL,
  userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  accessToken TEXT,
  refreshToken TEXT,
  idToken TEXT,
  accessTokenExpiresAt INTEGER,
  refreshTokenExpiresAt INTEGER,
  scope TEXT,
  password TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification" (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expiresAt INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

-- ============================================================
-- CMS tables
-- ============================================================

CREATE TABLE IF NOT EXISTS "categories" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "tags" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "posts" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  categoryId INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  authorId TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  publishedAt INTEGER
);

CREATE TABLE IF NOT EXISTS "post_tags" (
  postId TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tagId INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (postId, tagId)
);

CREATE TABLE IF NOT EXISTS "pages" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "media" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT,
  mimeType TEXT,
  size INTEGER NOT NULL DEFAULT 0,
  key TEXT NOT NULL,
  uploadedBy TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  createdAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "comments" (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  postId TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  authorId TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  createdAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "roles" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  createdAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "permissions" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  createdAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "role_permissions" (
  roleId TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permissionId TEXT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (roleId, permissionId)
);

CREATE TABLE IF NOT EXISTS "user_roles" (
  userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  roleId TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (userId, roleId)
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_session_userId ON "session"(userId);
CREATE INDEX IF NOT EXISTS idx_account_userId ON "account"(userId);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_authorId ON posts(authorId);
CREATE INDEX IF NOT EXISTS idx_posts_categoryId ON posts(categoryId);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_media_uploadedBy ON media(uploadedBy);
CREATE INDEX IF NOT EXISTS idx_comments_postId ON comments(postId);
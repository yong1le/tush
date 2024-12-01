# Tush - Image Mockup Generator

The name **Tush** is derived from 图设 (Tú Shè), which means "Image Design" in Chinese.
**Tush** is a simple image mockup generator that allows you to add seamless device
frames around your images.

## Project Setup

### Database

For database, I use drizzle as the ORM. Additionally, I use Better Auth to manage my users.

- `drizzle.config.ts`: Defines details of the database connection
- `src/server/db/index.ts`: Creates the database connection and exports an instance of the database connection
- `src/server/db/schema.ts`: Defines the database schema(s)

Use `npx drizzle push` to push schema changes to the database.

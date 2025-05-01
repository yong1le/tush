# Tush - Image Mockup Generator

The name **Tush** is derived from 图设 (Tú Shè), which means "Image Design" in Chinese.
**Tush** is an image toolbox that can perform various image processing tasks.

## Architecture

![image](https://github.com/user-attachments/assets/6bec0d8e-9300-4e92-9fd1-a31647b5ca03)

## Developing

```bash
# Create .env file based on .env.base (fill in github keys)
cp .env.base .env

# Start local services (s3, lambda, postgres)
docker compose up -d

# Push database schema
npm install
npx drizzle-kit push

# Start app on localhost:3000
npm run dev

```

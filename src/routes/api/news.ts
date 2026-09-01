import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

const CHANNEL = "AlphaSignalsPro";
const NEWS_LIMIT = 20;
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=15, s-maxage=30, stale-while-revalidate=60",
  "CDN-Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
};

export const Route = createFileRoute("/api/news")({
  server: {
    handlers: {
      GET: async () => {
        const sql = await getSql();
        const rows = await sql.query<{
          id: number;
          text: string;
          published_at: string;
          message_url: string | null;
          has_photo: boolean;
        }>(
          `select id, text, published_at, message_url,
                  (photo_data is not null) as has_photo
           from telegram_posts
           where chat_username = $1
           order by published_at desc
           limit $2`,
          [CHANNEL, NEWS_LIMIT],
        );

        return Response.json(
          {
            posts: rows.map((row) => ({
              id: Number(row.id),
              text: row.text,
              publishedAt: new Date(row.published_at).toISOString(),
              messageUrl: row.message_url,
              hasPhoto: Boolean(row.has_photo),
            })),
          },
          { headers: CACHE_HEADERS },
        );
      },
    },
  },
});

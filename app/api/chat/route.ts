import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai';
import { google } from "@ai-sdk/google";
import z from 'zod';
import { db } from '@/app/db/db';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const SYSTEM_PROMPT = `You are an expert sql assistant that helps users to query their database using natural language.
  ${new Date().toLocaleString('sv-SE')}
  you have access to following tools:
  1. db tool - call this tool to query the database.
  2. schema tool - call this tool to get the database schema which will help you to write sql query.

  Rules:
  -Generate only select queries(no insert,update,delete,drop)
  -Always use the schema provided by the schema tool
  -Return valid sqlite syntax

  Always respond in a helpful, conversational tone while being technically accurate.`;

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: await convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    stopWhen:stepCountIs(5),
    tools: {
      schema: tool({
        description: 'Call this tool to get database schema information',
        inputSchema: z.object({}),
        execute: async () => {
          return `CREATE TABLE products (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    price real NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE sales (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    product_id integer NOT NULL,
    total_amount real NOT NULL,
    quantity integer NOT NULL,
    sale_date text DEFAULT CURRENT_TIMESTAMP NOT NULL,
    region text NOT NULL,
    customer_name text NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE no action ON DELETE no action
);`
        }
      }),
      db: tool({
        description:'Call this tool to query a database.',
        inputSchema:z.object({
          query: z.string().describe('The SQL query to be ran.'),
        }),
        execute: async({query})=>{
          return await db.run(query)
        }
      })
    }
  });

  return result.toUIMessageStreamResponse();
}
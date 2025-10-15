import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import OpenAI from 'openai';
import z from 'zod';

const app = express();

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

app.use(express.json());

app.post('/generate', async (req, res) => {
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_completion_tokens: 100,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'developer',
        content:
          'Liste tres produtos que atendam a necessidade do usuario. responda em json em formato {produtos: string[]}',
      },
      {
        role: 'user',
        content: req.body.message,
      },
    ],
  });

  const output = JSON.parse(completion.choices[0].message.content ?? '');
  const schema = z.object({
    produtos: z.array(z.string()),
  });
  
const result = schema.safeParse(output);

if (!result.success) {  
  return res.status(500).end();
 } 




  res.json(output);
});

export default app;
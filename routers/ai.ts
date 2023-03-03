import { Router } from 'express';
import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPENAI_KEY,
    })
);

export default function ai() {
    const router = Router();

    router
        .post('/', async (req, res, next) => {
            const body = req.body;

            if (!body.prompt) {
                return next({
                    status: 400,
                    message: 'Prompt needed to continue',
                });
            }

            try {
                const completion = await openai.createCompletion({
                    model: 'text-davinci-003',
                    prompt: body.prompt,
                    temperature: 0.6,
                    max_tokens: 1000,
                });

                res.json(completion.data);
            } catch (e) {
                return next({
                    status: 500,
                    message: (e as any).data,
                });
            }
        });

    return router;
}
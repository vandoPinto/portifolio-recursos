import express from 'express';

const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const port = 3000;

app.use(express.json());

const userId = 'ziV8FVCBDsfjzXhWAV8Cryo2Fuj1';
const secretKey = '10dd8a9adc9a4d47ae3f9d6d8751bdba';

app.post('/generate-audio', async (req, res) => {
    const { voiceId, text } = req.body;

    try {
        const createResponse = await fetch('https://api.play.ht/v1/convert', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userId}:${secretKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                voice: voiceId,
                text: text
            })
        });

        const createData = await createResponse.json();
        const taskId = createData.taskId;

        const getStatus = async () => {
            const statusResponse = await fetch(`https://api.play.ht/v1/status/${taskId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userId}:${secretKey}`
                }
            });

            const statusData = await statusResponse.json();
            if (statusData.status === 'completed') {
                return statusData.audioUrl;
            } else {
                throw new Error('Áudio ainda não está pronto');
            }
        };

        for (let i = 0; i < 5; i++) {
            try {
                const audioUrl = await getStatus();
                return res.json({ audioUrl });
            } catch (error) {
                console.error('Tentativa', i + 1, ':', error.message);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        throw new Error('Falha ao obter a URL do áudio após várias tentativas');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

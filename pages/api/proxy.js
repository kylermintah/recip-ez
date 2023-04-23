// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await axios.post(
        'https://us-central1-fridgeflip.cloudfunctions.net/generate_embedding',
        req.body,
      );
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error proxying request:', error);
      res.status(500).json({ error: 'An error occurred while proxying the request' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}


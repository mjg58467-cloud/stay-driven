export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ status: 'method_not_allowed' });
  }

  return res.status(200).json({
    status: 'ok',
    receivedAt: new Date().toISOString(),
  });
}

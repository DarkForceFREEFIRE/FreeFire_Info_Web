export default async function handler(req, res) {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ status: 'error', message: 'Token is required' });
    }

    try {
        const targetUrl = `https://wzjwt.vercel.app/api/process?mode=access_token&data=${encodeURIComponent(token)}`;
        
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ status: 'error', message: 'Proxy request failed' });
    }
}

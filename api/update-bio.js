export default async function handler(req, res) {
    const { token, bio, region } = req.query;

    if (!token || !bio) {
        return res.status(400).json({ success: false, msg: 'Missing required parameters.' });
    }

    try {
        let targetUrl = `https://wzlongsign.vercel.app/updatebio?token=${encodeURIComponent(token)}&bio=${encodeURIComponent(bio)}`;
        if (region) {
            targetUrl += `&region=${encodeURIComponent(region)}`;
        }

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*'
            }
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ success: false, msg: 'Failed to contact signature API.' });
    }
}

const express = require('express');
const ytdlp = require('yt-dlp-exec');

const app = express();
const port = 3000;

app.get('/play-audio', async (req, res) => {
  const videoUrl = req.query.url; // YouTube URL passed in query parameters

  if (!videoUrl) {
    return res.status(400).send('You must provide a YouTube URL');
  }

  try {
    // Extract audio using yt-dlp
    const result = await ytdlp(videoUrl, {
      extractAudio: true,
      audioFormat: 'mp3',  // You can also choose 'aac' or 'opus' if preferred
      output: '-',  // Output directly to stdout
      noCheckCertificates: true,  // Disable SSL certificate checks (sometimes helpful)
      quiet: true,  // Suppresses unnecessary output
      cookie: 'your_cookie_here',  // (Optional) Pass your YouTube cookies here if needed
    });

    // Set the response headers for streaming MP3 audio
    res.header('Content-Type', 'audio/mp3');

    // Pipe the audio directly to the client
    result.stdout.pipe(res);
  } catch (err) {
    res.status(500).send(`Error streaming audio: ${err.message}`);
  }
});

// Serve an HTML page to enter the YouTube URL
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="background-color: rgb(43, 43, 43)">
        <h1>Stream YouTube Audio</h1>
        <form action="/play-audio" method="get">
          <label for="url">Enter YouTube URL:</label>
          <input type="text" id="url" name="url" required />
          <button type="submit">Listen Audio</button>
        </form>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

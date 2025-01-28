const express = require('express');
const ytdl = require('@distube/ytdl-core');

const app = express();
const port = 3000;

app.get('/play-audio', async (req, res) => {
  const videoUrl = req.query.url;  // YouTube URL passed in query parameters

  if (!videoUrl) {
    return res.status(400).send('You must provide a YouTube URL');
  }

  try {
    // Add your cookies here (make sure to keep them secure)
    const cookies = 'YSC=iSt7adM2coM; VISITOR_INFO1_LIVE=uJVOux2ApX8; PREF=f6=40000000&tz=Asia.Calcutta&f7=101&f5=20000;';

    // Get the video info using ytdl-core
    const info = await ytdl.getInfo(videoUrl);
    const title = info.videoDetails.title;

    // Stream the audio only (highest quality audio stream)
    const audioStream = ytdl(videoUrl, {
      filter: 'audioonly',
      quality: 'highestaudio',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'Cookie': cookies  // Include the cookies here
      }
    });

    // Set the correct MIME type for audio
    res.header('Content-Type', 'audio/mp3');

    // Pipe the audio stream directly to the response (this sends it to the browser)
    audioStream.pipe(res);

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

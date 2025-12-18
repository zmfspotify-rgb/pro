const http = require('http');

/**
 * Start monitoring HTTP server
 */
function startMonitoring(state, port) {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    if (req.url === '/status') {
      const status = {
        uptime: process.uptime(),
        bots: state.bots.map(bot => ({
          username: bot.username,
          connected: bot.instance ? bot.instance.entity !== null : false,
          viewerPort: bot.viewerPort
        })),
        isRunning: state.isRunning,
        config: {
          schedulerEnabled: state.config.scheduler.enabled,
          captureMode: state.config.capture.mode,
          twitchEnabled: state.config.twitch.enabled
        }
      };
      
      res.writeHead(200);
      res.end(JSON.stringify(status, null, 2));
    } else if (req.url === '/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'healthy' }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  });
  
  server.listen(port, () => {
    console.log(`[Monitoring] Server listening on http://localhost:${port}`);
    console.log(`[Monitoring] Status endpoint: http://localhost:${port}/status`);
    console.log(`[Monitoring] Health endpoint: http://localhost:${port}/health`);
  });
  
  return server;
}

module.exports = { startMonitoring };

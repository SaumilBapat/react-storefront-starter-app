if (process.env.preact === 'true') {
  const moduleAlias = require('module-alias')
  moduleAlias.addAlias('react', 'preact/compat')
  moduleAlias.addAlias('react-dom', 'preact/compat')
  moduleAlias.addAlias('react-ssr-prepass', 'preact-ssr-prepass')
}

const express = require('express')
const port = parseInt(process.env.port, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const path = require('path')
const { parse } = require('url')
const next = require('next')
const app = next({ dev })
const handle = app.getRequestHandler()
const client = require('twilio')(
  'ACdd70224eb6cfc04af2a7b2a5ce8659b4',
  '1705af9c1fc4c2bb0e7528ca887602b2'
);

app.prepare().then(() => {
  const server = express()

  server.post('/api/messages', (req, res) => {
    res.header('Content-Type', 'application/json');
    client.messages
      .create({
        from: '12138639081',
        to: '16475002510' || req.body.to,
        body: 'Order #W8432 is currrently in Processing. Please respond back here if you request addtional help or updates!' || req.body.body
      })
      .then(() => {
        res.send(JSON.stringify({ success: true }));
      })
      .catch(err => {
        console.log(err);
        res.send(JSON.stringify({ success: false }));
      });
  });

  server.get('/service-worker.js', (req, res) => {
    app.serveStatic(req, res, path.join(__dirname, '.next', 'static', 'service-worker.js'))
  })

  server.get('/pages-manifest.json', (req, res) => {
    app.serveStatic(req, res, path.join(__dirname, '.next', 'server', 'pages-manifest.json'))
  })

  server.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

import express = require("express");
import helmet = require("helmet");
import path = require("path");
import prometheus = require("prom-client");

import Auth = require("./server/auth");

import proxy = require("./server/proxy");

import unleashRoutes = require("./server/routes/unleashRoutes");

// Prometheus metrics
const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["route"],
  // buckets for response time from 0.1ms to 500ms
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
});
const server = express();

server.use(express.json());
server.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const nocache = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};

const setupServer = async () => {
  const authClient = await Auth.setupAuth(server);

  server.use(proxy.setupProxy(authClient));

  const DIST_DIR = path.join(__dirname, "dist");
  const HTML_FILE = path.join(DIST_DIR, "index.html");

  server.use("/static", express.static(DIST_DIR));

  server.post("/unleash/toggles", (req, res) => {
    const toggles = req.body.toggles;
    const unleashToggles = unleashRoutes.unleashToggles(
      toggles,
      req.query.valgtEnhet,
      req.query.userId
    );

    res.status(200).send(unleashToggles);
  });

  server.get(
    [
      "/",
      "/sykefravaer",
      "/sykefravaer/*",
      /^\/sykefravaer\/(?!(resources)).*$/,
    ],
    nocache,
    (req, res) => {
      res.sendFile(HTML_FILE);
      httpRequestDurationMicroseconds.labels(req.route.path).observe(10);
    }
  );

  server.get(
    "/actuator/metrics",
    (req: express.Request, res: express.Response) => {
      res.set("Content-Type", prometheus.register.contentType);
      res.end(prometheus.register.metrics());
    }
  );

  server.get(
    "/health/isAlive",
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );

  server.get(
    "/health/isReady",
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );

  const port = 8080;

  server.listen(port, () => {
    console.log(`App listening on port: ${port}`);
  });
};

setupServer();

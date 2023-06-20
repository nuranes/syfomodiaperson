import { merge } from "webpack-merge";
import mockEndepunkter from "./mock/mockEndepunkter";

const express = require("express");
const common = require("./webpack.common.ts");
const path = require("path");

import * as Session from "./server/session";

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    port: 8080,
    static: {
      directory: path.join(__dirname, "dist"),
      staticOptions: {
        redirect: false,
      },
    },
    setupMiddlewares: (middlewares: any, devServer: any) => {
      setupDev(devServer);
      return middlewares;
    },
  },
});

const setupDev = async (devServer: any) => {
  const { app, compiler } = devServer;

  await Session.setupSession(app);

  mockEndepunkter(app);
  app.use("/static", express.static(path.resolve(__dirname, "dist")));

  app.use("*", (req: any, res: any) => {
    const filename = path.join(compiler.outputPath, "index.html");
    compiler.outputFileSystem.readFile(filename, (err: any, result: any) => {
      if (err) {
        res.status(404).sendFile(path.resolve(__dirname, "public/error.html"));
        return;
      }

      res.set("Content-Type", "text/html");
      res.send(result);
      res.end();
    });
  });
};

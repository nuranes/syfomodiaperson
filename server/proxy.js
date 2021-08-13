const express = require("express");
const proxy = require("express-http-proxy");
const cookieParser = require("cookie-parser");
const axios = require("axios");

const Config = require("./config.js");

const setup = () => {
  const router = express.Router();

  router.use(
    "/fastlegerest/api",
    proxy(Config.auth.fastlegerest.host, {
      https: true,
      proxyReqPathResolver: function (req) {
        return `/fastlegerest/api${req.url}`;
      },
      proxyErrorHandler: function (err, res, next) {
        console.error("Error in proxy for fastlegerest", err.message);
        next(err);
      },
    })
  );

  router.use(
    "/ispersonoppgave/api/get",
    cookieParser(),
    proxy(Config.auth.ispersonoppgave.host, {
      https: true,
      parseReqBody: false,
      proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        const token = srcReq.cookies["isso-idtoken"];
        proxyReqOpts.headers["Authorization"] = `Bearer ${token}`;
        proxyReqOpts.headers["Content-Type"] = "application/json";
        return proxyReqOpts;
      },
      proxyReqPathResolver: function (req) {
        return `/api${req.path}`;
      },
      proxyErrorHandler: function (err, res, next) {
        console.error("Error in proxy for ispersonoppgave", err.message);
        next(err);
      },
    })
  );

  router.use(
    "/syfo-tilgangskontroll/api",
    proxy(Config.auth.syfotilgangskontroll.host, {
      https: true,
      proxyReqPathResolver: function (req) {
        return `/syfo-tilgangskontroll/api${req.url}`;
      },
      proxyErrorHandler: function (err, res, next) {
        console.error("Error in proxy for tilgang", err.message);
        next(err);
      },
    })
  );

  router.use(
    "/modiacontextholder/api",
    proxy(Config.auth.modiacontextholder.host, {
      https: true,
      proxyReqPathResolver: function (req) {
        return `/modiacontextholder/api${req.url}`;
      },
      proxyErrorHandler: function (err, res, next) {
        console.error("Error in proxy for modiacontextholder", err.message);
        next(err);
      },
    })
  );

  router.use(
    "/ispersonoppgave/api/post",
    cookieParser(),
    proxy(Config.auth.ispersonoppgave.host, {
      https: true,
      parseReqBody: true,
      proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        const token = srcReq.cookies["isso-idtoken"];
        proxyReqOpts.headers["Authorization"] = `Bearer ${token}`;
        proxyReqOpts.headers["Content-Type"] = "application/json";
        return proxyReqOpts;
      },
      proxyReqPathResolver: function (req) {
        return `/api${req.path}`;
      },
      proxyErrorHandler: function (err, res, next) {
        console.error("Error in proxy for ispersonoppgave", err.message);
        next(err);
      },
    })
  );

  router.use(
    "/isdialogmote/api/get",
    cookieParser(),
    proxy(Config.auth.isdialogmote.host, {
      https: true,
      parseReqBody: false,
      proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        const token = srcReq.cookies["isso-idtoken"];
        proxyReqOpts.headers["Authorization"] = `Bearer ${token}`;
        proxyReqOpts.headers["Content-Type"] = "application/json";
        return proxyReqOpts;
      },
      proxyReqPathResolver: function (req) {
        return `/api${req.url}`;
      },
      proxyErrorHandler: function (err, res, next) {
        console.log("Error in proxy for isdialogmote", err.message);
        next(err);
      },
    })
  );

  router.use(
    "/isdialogmote/api/post",
    cookieParser(),
    proxy(Config.auth.isdialogmote.host, {
      https: true,
      parseReqBody: true,
      proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        const token = srcReq.cookies["isso-idtoken"];
        proxyReqOpts.headers["Authorization"] = `Bearer ${token}`;
        return proxyReqOpts;
      },
      proxyReqPathResolver: function (req) {
        return `/api${req.url}`;
      },
      proxyErrorHandler: function (err, res, next) {
        console.log("Error in proxy for isdialogmote", err.message);
        next(err);
      },
    })
  );

  router.use(
    "/modiasyforest/api",
    proxy(Config.auth.modiasyforest.host, {
      https: true,
      proxyReqPathResolver: function (req) {
        return `/modiasyforest/api${req.url}`;
      },
      proxyErrorHandler: function (err, res, next) {
        console.error("Error in proxy for modiasyforest", err.message);
        next(err);
      },
    })
  );

  router.use(
    "/syfooppfolgingsplanservice/api",
    proxy(Config.auth.syfooppfolgingsplanservice.host, {
      https: true,
      proxyReqPathResolver: function (req) {
        return `/syfooppfolgingsplanservice/api${req.url}`;
      },
      proxyErrorHandler: function (err, res, next) {
        console.error(
          "Error in proxy for syfooppfolgingsplanservice",
          err.message
        );
        next(err);
      },
    })
  );

  router.use(
    "/syfomoteadmin/api",
    proxy(Config.auth.syfomoteadmin.host, {
      https: true,
      proxyReqPathResolver: function (req) {
        return `/syfomoteadmin/api${req.url}`;
      },
      proxyErrorHandler: function (err, res, next) {
        console.error("Error in proxy for syfomoteadmin", err.message);
        next(err);
      },
    })
  );

  router.use("/veileder/vedtak", cookieParser(), (req, res) => {
    const token = req.cookies["isso-idtoken"];
    const fnr = req.query.fnr;
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        fnr,
      },
    };

    const url = `https://${Config.auth.flexInternGateway.host}/spinnsyn-backend/api/v1/veileder/vedtak?fnr=${fnr}`;
    axios
      .get(url, options)
      .then((response) => {
        res.send(response.data);
      })
      .catch((err) => {
        console.error("Error in proxy for spinnsyn-backend", err.message);
        res.sendStatus(err.response.status);
      });
  });

  router.use(
    "/syfomotebehov/api",
    proxy(Config.auth.syfomotebehov.host, {
      https: true,
      proxyReqPathResolver: function (req) {
        return `/syfomotebehov/api${req.url}`;
      },
      proxyErrorHandler: function (err, res, next) {
        console.error("Error in proxy for syfomotebehov", err.message);
        next(err);
      },
    })
  );

  router.use(
    "/syfosoknad/api",
    proxy(Config.auth.syfosoknad.host, {
      https: true,
      proxyReqPathResolver: function (req) {
        return `/syfosoknad/api${req.url}`;
      },
      proxyErrorHandler: function (err, res, next) {
        console.error("Error in proxy for syfosoknad", err.message);
        next(err);
      },
    })
  );

  router.use(
    "/syfobehandlendeenhet/api",
    proxy(Config.auth.syfobehandlendeenhet.host, {
      https: true,
      proxyReqPathResolver: function (req) {
        return `/api${req.url}`;
      },
      proxyErrorHandler: function (err, res, next) {
        console.error("Error in proxy for syfobehandlendeenhet", err.message);
        next(err);
      },
    })
  );

  router.use(
    "/syfoperson/api",
    proxy(Config.auth.syfoperson.host, {
      https: true,
      proxyReqPathResolver: function (req) {
        return `/syfoperson/api${req.url}`;
      },
      proxyErrorHandler: function (err, res, next) {
        console.error("Error in proxy for syfoperson", err.message);
        next(err);
      },
    })
  );

  router.use("/syfosmregister/api", cookieParser(), (req, res) => {
    const token = req.cookies["isso-idtoken"];
    const fnr = req.query.fnr;
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        fnr,
      },
    };

    const url = `http://${Config.auth.syfosmregister.host}/api/v1/internal/sykmeldinger`;
    axios
      .get(url, options)
      .then((response) => {
        res.send(response.data);
      })
      .catch((err) => {
        console.error("Error in proxy for syfosmregister", err.message);
        res.sendStatus(err.response.status);
      });
  });

  router.use(
    "/ispengestopp/api/v1/person/status",
    cookieParser(),
    (req, res) => {
      const token = req.cookies["isso-idtoken"];
      const fnr = req.query.fnr;
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
          fnr,
        },
      };

      axios
        .get(
          `http://${Config.auth.ispengestopp.host}/api/v1/person/status`,
          options
        )
        .then((response) => {
          if (response.status === 204) {
            res.sendStatus(204);
          } else {
            res.send(response.data);
          }
        })
        .catch((err) => {
          console.error("Error in proxy for ispengestopp", err.message);
          res.sendStatus(err.response.status);
        });
    }
  );

  router.use(
    "/ispengestopp/api/v1/person/flagg",
    cookieParser(),
    (req, res) => {
      const token = req.cookies["isso-idtoken"];
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const data = req.body;

      axios
        .post(
          `http://${Config.auth.ispengestopp.host}/api/v1/person/flagg`,
          data,
          {
            headers,
          }
        )
        .then((response) => {
          res.sendStatus(response.status);
        })
        .catch((err) => {
          console.log(err.message);
          res.sendStatus(err.response.status);
        });
    }
  );

  router.use("/isprediksjon/api/v1/prediksjon", cookieParser(), (req, res) => {
    const token = req.cookies["isso-idtoken"];
    const options = {
      headers: {
        ...req.headers,
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get(`http://${Config.auth.isprediksjon.host}/api/v1/prediksjon`, options)
      .then((response) => {
        if (response.status === 204) {
          res.sendStatus(204);
        } else {
          res.send(response.data);
        }
      })
      .catch((err) => {
        console.error("Error in proxy for isprediksjon", err.message);
        res.sendStatus(err.response.status);
      });
  });

  router.use(
    "/syfoveileder/api",
    proxy(Config.auth.syfoveileder.host, {
      https: true,
      proxyReqPathResolver: function (req) {
        return `/syfoveileder/api/v1/${req.url}`;
      },
      proxyErrorHandler: function (err, res, next) {
        console.error("Error in proxy for syfoveileder", err);
        next(err);
      },
    })
  );

  router.use(
    "/internarbeidsflatedecorator",
    proxy(Config.auth.internarbeidsflatedecoratorHost, {
      https: true,
      proxyReqPathResolver: (req) => {
        return `/internarbeidsflatedecorator${req.url}`;
      },
      proxyErrorHandler: (err, res, next) => {
        console.log(
          `Error in proxy for internarbeidsflatedecorator ${err.message}, ${err.code}`
        );
        if (err && err.code === "ECONNREFUSED") {
          console.log("proxyErrorHandler: Got ECONNREFUSED");
          return res
            .status(503)
            .send({ message: `Could not contact internarbeidsflatedecorator` });
        }
        next(err);
      },
    })
  );

  return router;
};

module.exports = setup;
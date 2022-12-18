import express from "express";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

const PORT = 3000;
const app = express();

Sentry.init({
    //get dsn: [Project] > Settings > Client Keys (DSN)
    dsn: "https://06725fbdaada4ccebeba6a85a2b7d457@o4504347727233024.ingest.sentry.io/4504347794669568",
    integrations: [
        //enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],

    tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.get("/", function rootHandler(req, res) {
    res.end("Hello world!");
});

app.use(Sentry.Handlers.errorHandler());

app.use(function onError(err, req, res, next) {
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});

app.listen(PORT, () => {
    console.log("App running on port: " + PORT)
})

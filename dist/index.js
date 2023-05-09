import express from "express";
import path from "path";
import { ExtendedClient } from "./structures/client.js";
const app = express();
const __dirname = path.resolve();
app.get("/callback", (_, res) => {
    res.send(`<script>location.replace('./gut.html')</script>`);
    res.end();
});
app.use(express.static(path.join(__dirname, "public")));
app.listen(process.env.PORT || 3000);
const client = new ExtendedClient();
export { client };

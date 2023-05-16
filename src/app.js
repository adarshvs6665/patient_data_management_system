const express = require('express');
const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 5001
const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);

app.use("/api/v1/test", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`⚡️ [server]: Server is running at http://localhost:${PORT}`);
});

const express = require("express");
const axios = require("axios");

const { getCache, setCache } = require("../services/cache");
const { logRequest } = require("../services/analytics");
const { addHistory } = require("../services/history");
const { generateHash } = require("../utils/hash");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const input = req.body;
    const key = generateHash(input);

    // 🔹 cache check
    const cached = getCache(key);
    if (cached) {
      res.setHeader("Content-Type", "text/event-stream");
      res.write(cached);
      return res.end();
    }

    // 🔥 Python call
    const response = await axios({
      method: "post",
      url: "http://localhost:8000/solve",
      data: input,
      responseType: "stream",
      timeout: 0,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");

    let fullData = "";

    response.data.on("data", (chunk) => {
      const chunkStr = chunk.toString();
      fullData += chunkStr;

      res.write(chunkStr); // forward stream
    });

    response.data.on("end", () => {
      logRequest(true);
      setCache(key, fullData);
      addHistory({ input, result: fullData });

      res.end();
    });

    response.data.on("error", (err) => {
      console.error("STREAM ERROR:", err.message);
      logRequest(false);

      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    });

  } catch (err) {
    console.error("AXIOS ERROR:", err.response?.data || err.message);

    logRequest(false);

    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
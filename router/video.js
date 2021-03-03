const express = require("express");
const path = require("path");
// const fs = require("fs");
// const awaitWriteStream = require("await-stream-ready").write;
const Busboy = require("busboy");
const uploadFile = require("../utils/upload_s3");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hi api!");
});

router.post("/upload_file", async (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  busboy.on("file", async (fieldname, file, filename, encoding, mimetype) => {
    try {
      //console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      // Define path
      const upload_name =
        Date.now() + path.extname(filename).toLocaleLowerCase();
      //   const target = path.join("public", upload_name);
      // set writer
      //   const writeStream = fs.createWriteStream(target);

      console.log("Start upload");
      // async write stream
      //   await awaitWriteStream(file.pipe(writeStream));
      uploadFile(file, upload_name);

      console.log("Upload done!");
    } catch (err) {
      // close channel when error is caught
      //   await sendToWormhole(stream);
      // set error response
      res.json({ success: false });
    }
    res.json({ success: true });
  });
  req.pipe(busboy);
});

module.exports = router;

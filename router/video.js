const express = require('express');
const path = require('path');
const fs = require('fs');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const Busboy = require('busboy');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hi api!');
});

router.post('/upload_file', async (req, res) => {
    const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
        //console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        // 获取文件流
        const stream = file;
        // 定义文件名
        const upload_name = Date.now() + path.extname(filename).toLocaleLowerCase()
        // 目标文件
        const target = path.join('public', upload_name);
        //
        const writeStream = fs.createWriteStream(target);
        try {
            console.log('Start upload');
            //异步把文件流 写入
            await awaitWriteStream(stream.pipe(writeStream));
            console.log('Upload done!');
        } catch (err) {
            //如果出现错误，关闭管道
            await sendToWormhole(stream);
            // 自定义方法
            res.json({ success: false });
        }
        res.json({ success: true });
    });
    req.pipe(busboy);

});

module.exports = router;
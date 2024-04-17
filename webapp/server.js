const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'static'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let scriptRunning = false;
let fmProcess;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const freq = req.body.freq;
    const rate = req.body.rate;
    console.log(path.join(__dirname, req.file.path));
    console.log(path.join("../webapp/", req.file.path), req.body.freq, req.body.rate);
    fmProcess = spawn('python', ['../rf/fm.py', path.join(__dirname, req.file.path), freq, rate], {
        detached: true,
        stdio: 'ignore'
    });
    scriptRunning = true;

    fmProcess.on('data', (data) => {
        console.log(`Python script output: ${data}`);
    });

    fmProcess.on('error', (data) => {
        console.error(`Error from Python script: ${data}`);
        scriptRunning = false;
    });

    fmProcess.on('exit', (code, data) => {
        console.log(`Python script process exited with code ${code} :: data ${data}`);
        scriptRunning = false;
    });

    res.status(200).send('File uploaded successfully');
});

app.get('/stop', (req, res) => {
    const uploadDirectory = path.join(__dirname, 'public/uploads');

    if (fmProcess) {
        fmProcess.kill();
        //res.status(200).send('Python script stopping');
    }

    fs.readdir(uploadDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Error clearing uploaded files');
        }

        files.forEach(file => {
            fs.unlink(path.join(uploadDirectory, file), err => {
                if (err) {
                    console.error(`Error deleting file ${file}:`, err);
                }
            });
        });

        res.status(200).send('Uploaded files cleared successfully');
    });
});

app.get('/status', (req, res) => {
    res.send(scriptRunning ? 'Running' : 'Stopped');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

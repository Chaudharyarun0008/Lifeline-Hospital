const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const FILE_NAME = "patient_registry.txt";

/* HOME PAGE */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ADD PATIENT */
app.post("/add-patient", (req, res) => {

    const {
        name,
        age,
        gender,
        dob,
        phone,
        address,
        disease
    } = req.body;

    /* BASIC VALIDATION */
    if (
        !name ||
        !age ||
        !gender ||
        !dob ||
        !phone ||
        !address ||
        !disease
    ) {
        return res.send("<h2>All fields are required.</h2>");
    }

    const patientData = `
========================================
Patient Name : ${name}
Age          : ${age}
Gender       : ${gender}
DOB          : ${dob}
Phone        : ${phone}
Address      : ${address}
Disease      : ${disease}
Registered On: ${new Date().toLocaleString()}
========================================

`;

    fs.appendFile(FILE_NAME, patientData, (err) => {

        if (err) {
            return res.send("<h2>Error saving patient data.</h2>");
        }

        res.send(`
        <html>
        <head>
            <title>Registration Successful</title>

            <style>

                body{
                    font-family:Segoe UI,sans-serif;
                    background:#f4f8fb;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    height:100vh;
                }

                .box{
                    background:white;
                    padding:40px;
                    border-radius:20px;
                    text-align:center;
                    box-shadow:0 10px 30px rgba(0,0,0,.15);
                    max-width:500px;
                }

                h1{
                    color:#0077b6;
                    margin-bottom:15px;
                }

                a{
                    display:inline-block;
                    margin:10px;
                    padding:12px 20px;
                    background:#0077b6;
                    color:white;
                    text-decoration:none;
                    border-radius:8px;
                }

                a:hover{
                    background:#023e8a;
                }

            </style>

        </head>

        <body>

            <div class="box">

                <h1>✅ Patient Registered Successfully</h1>

                <p>
                    The patient information has been stored
                    in the hospital registry.
                </p>

                <a href="/">
                    Register Another Patient
                </a>

                <a href="/patients">
                    View Records
                </a>

            </div>

        </body>
        </html>
        `);
    });
});

/* VIEW PATIENTS */
app.get("/patients", (req, res) => {

    fs.readFile(FILE_NAME, "utf8", (err, data) => {

        if (err || data.trim() === "") {

            return res.send(`
            <h1 style="
                text-align:center;
                margin-top:100px;
                font-family:Segoe UI;
                color:#023e8a;
            ">
                No patient records found.
            </h1>
            <div style="text-align:center;">
                <a href="/">Back to Home</a>
            </div>
            `);
        }

        res.send(`
        <html>

        <head>

            <title>Patient Records</title>

            <style>

                body{
                    background:#f4f8fb;
                    font-family:Segoe UI,sans-serif;
                    padding:40px;
                }

                h1{
                    text-align:center;
                    color:#023e8a;
                    margin-bottom:30px;
                }

                .box{
                    background:white;
                    max-width:1000px;
                    margin:auto;
                    padding:30px;
                    border-radius:20px;
                    box-shadow:0 10px 30px rgba(0,0,0,.12);
                }

                pre{
                    white-space:pre-wrap;
                    line-height:1.8;
                    font-size:15px;
                }

                a{
                    display:block;
                    text-align:center;
                    margin-top:25px;
                    text-decoration:none;
                    color:#0077b6;
                    font-weight:bold;
                    font-size:18px;
                }

            </style>

        </head>

        <body>

            <h1>🏥 LifeLine Hospital Patient Records</h1>

            <div class="box">

                <pre>${data}</pre>

                <a href="/">
                    ← Back To Admission Form
                </a>

            </div>

        </body>

        </html>
        `);
    });
});

/* START SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
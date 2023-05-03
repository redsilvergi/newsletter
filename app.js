const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use("/public", express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post("/", (req, res) => {
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
          BIRTHDAY: "12/31",
          ADDRESS: {
            addr1: "123 Freddie Ave",
            city: "Atlanta",
            state: "GA",
            zip: "12345",
          },
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us13.api.mailchimp.com/3.0/lists/f3899407f4";

  const options = {
    method: "POST",
    auth: "silver:285991744e4696f85a3b7bd33fe867a0-us13",
  };

  const request1 = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      response.on("data", (data) => {
        console.log("data post successful");
      });
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }
  });

  request1.on("error", (e) => {
    console.log(`fucking fucking fucking fucking: ${e}`);
  });

  request1.write(jsonData);
  request1.end();
});

app.get("/failure", (req, res) => {
  res.redirect(`/`);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running");
});

const { getUserInfo } = require("@replit/repl-auth")
const express = require('express');
const Database = require("@replit/database");
const db = new Database();
const app = express();

// serve static files from "public" dir

app.use(express.static('public'));
app.use(express.json());

// first login / auth
app.get('/', (req, res) => {
  const user = getUserInfo(req);
  if (user) {
    res.sendFile(`${__dirname}/goals.html`);
  } else {
    res.sendFile(`${__dirname}/index.html`);
  }
})

// how to logout?
// BACK END
// app.post('/logout', (req, res) => {
//   console.log('/logout hit!')
//   res.clearCookie('REPL_AUTH');
//   return res.status(200).redirect('/');
// });

// BACK END
app.get('/logout', (req, res) => {
  console.log("/logout hit")
  res.clearCookie('REPL_AUTH');
  return res.status(200).redirect('/');
});

// function logout(req, res) {
//   res.clearCookie('REPL_AUTH');
//   return res.sendStatus(200);
// }


// get the current state of our goals

app.get("/data", (req, res) => {
  const user = getUserInfo(req);
  res.setHeader('Content-Type', 'application/json');
  if (user.id) {
    db.get(user.id).then((r) => {
      res.end(JSON.stringify(r));
    })
  } else {
    res.end(JSON.stringify({ error: 'no data! ' }))
  }
});

app.get('/old', (req, res) => {
  const user = getUserInfo(req);
  console.log("user:", user)
  if (user) {
    db.set(user.id, { name: user.name, rand: Math.floor(Math.random() * 1000) });

    db.list().then(console.log)
    db.getAll().then((resp) => {
      console.log('getall: ', resp)
      console.log(resp[user.id].name)
      res.send(`Hello there ${resp[user.id].name} with val: ${resp[user.id].rand}`)
    })
    // db.get(user.id).then((resp) => {
    //   console.log("response?", resp)
    //   res.send(`Hi there, ${resp}`)
    // }
    //)
  } else {
    res.send("No user ")
  }

  // res.send(`Hello, ${user.name}`)
})


app.post("/set", (req, res) => {
  const user = getUserInfo(req);
  console.log("req.body", req.body)
  let data = req.body;
  if(user.id){
     data.name = user.name
  db.set(user.id, req.body)
  }
 

  res.send(req.body)
})

app.listen(3000, () => {
  console.log('server started');
});

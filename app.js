const { response } = require('express')
const express = require('express')
const https = require('https')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static(`public`))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html')
})

app.post('/failure', (req, res) => {
  res.redirect('/')
})
app.post('/', (req, res) => {
  var { firstName, mailId, lastName } = req.body
  const data = {
    members: [
      {
        email_address: mailId,
        status: `subscribed`,
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }
  var jsonData = JSON.stringify(data)
  var apiServer = "us20"
  var listId = "e02d18e387"
  var apiKey = "17c0e6c3e617ffc436bbcad32ed8ef4b-us20"
  var apiUrl = `https://${apiServer}.api.mailchimp.com/3.0/lists/${listId}`
  var options = {
    method: "POST",
    auth: `key:${apiKey}` 

  }

  var request = https.request(apiUrl, options, (response) => {
    response.on("data", (data) => {
      var responseData = JSON.parse(data)
      if (responseData.error_count === 0) {
        res.sendFile(__dirname + '/success.html')
      }
      else {
        res.sendFile(__dirname + '/failure.html')
      }
    })
  })
  request.write(jsonData)
  request.end()

})

app.listen(process.env.PORT || 3000, () => {
  console.log(`port running successfully`)
})

/*17c0e6c3e617ffc436bbcad32ed8ef4b-us20
e02d18e387*/
const express = require('express')
const app = express()
app.use('/process', express.static('process'))
app.listen(80, () => {
    console.log('express server running at http://127.0.0.1')
})
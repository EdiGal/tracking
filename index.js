const express = require("express");
const app = express();
const path = require("path")
const publicPath = path.join(__dirname, 'public')
app.use(express.static(publicPath))

app.use("/products", require("./routes/products"))

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(publicPath, 'html') })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
    console.log(err || `App listen on port ${PORT}`)
})

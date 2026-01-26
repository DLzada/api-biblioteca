import express from 'express'

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('DLzzz')
})

app.listen(port, () => {
  console.log(`Server on na porta ${port}`)
})
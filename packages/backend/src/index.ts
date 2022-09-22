import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send({ hello: 'world' })
})

app.listen(3264, '0.0.0.0', () => console.log('Server listening at 3264'))

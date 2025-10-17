import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import rotas from '../rotas.js'

const app = express()

app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
  credentials: true 
}));
app.use(cookieParser())
app.use(express.json())
app.use(rotas)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor inicializado na porta ${PORT}.`)
})
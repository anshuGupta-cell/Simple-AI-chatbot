import express from "express"
import cors from 'cors'

import dotenv from "dotenv";
import { chat } from "./chat.js";

dotenv.config();
const app = express()
const port = 3000
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/chat", chat);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
import createServer from './infrastructure/config/app'
import { connectDB } from './infrastructure/config/connectDB'
import http from 'http'
import { config } from 'dotenv'
import { createAdmin } from './infrastructure/services/createAdmin'
config()
const startServer = async () => {
    try {
      await connectDB()
      const app = createServer()
      const server = http.createServer(app)
      
      await createAdmin()
      const port = process.env.PORT
      server?.listen(port, () => {
        console.log('server is running at port ', port)
      })
  
    } catch (error) {
      console.log(error)
    }
  }
  
  startServer()
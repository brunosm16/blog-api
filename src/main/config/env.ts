export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/blog-api',
  port: process.env.PORT ?? 3000,
  jwtSecret: process.env.JWT_SECRET ?? 'tj760==5H*'
}

import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

const { mongoUrl, port } = env

MongoHelper.connect(mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default

    app.listen(port, () =>
      console.log(`Server started and running at port : ${port}`)
    )
  })
  .catch(console.error)

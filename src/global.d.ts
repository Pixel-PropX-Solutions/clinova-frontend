declare global {
    let _mongoClientPromise: Promise<MongoClient> | undefined
  }
  
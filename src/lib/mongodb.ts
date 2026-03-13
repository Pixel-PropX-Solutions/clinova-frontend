import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient> = Promise.resolve(
  new MongoClient(uri, options)
);

try {
  if (process.env.NODE_ENV === "development") {
    if (
      !(global as { _mongoClientPromise?: Promise<MongoClient> })
        ._mongoClientPromise
    ) {
      client = new MongoClient(uri, options);
      (
        global as { _mongoClientPromise?: Promise<MongoClient> }
      )._mongoClientPromise = client.connect();
    }
    clientPromise = (global as { _mongoClientPromise?: Promise<MongoClient> })
      ._mongoClientPromise as Promise<MongoClient>;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} catch (e) {
  console.log(e);
}
export default clientPromise;

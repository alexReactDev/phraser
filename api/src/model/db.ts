import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb://127.0.0.1:27017/vocabulary";

const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } catch(e) {
	console.log("Database connection error");
	console.log(e);
  }
}

run();

export default (client.db() as any);
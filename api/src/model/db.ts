import { MongoClient, ServerApiVersion } from "mongodb";

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;

const uri = `mongodb://${host}:${port}/vocabulary`;

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
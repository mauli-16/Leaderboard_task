const express = require("express");
const app = express();
const port = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
const client = new MongoClient(process.env.MONGO_URL);


const cors = require("cors"); //for vercel and render connection using cors
app.use(cors());

app.use(express.json()); //for parsing json
const database = client.db("userList");//creating db
const history = database.collection("history");//creating collections
const user = database.collection("user");
//function to connect
const connectDB = async () => {
  try {
    await client.connect();
    console.log("mongodb connected successfully");
    //     const result=await user.insertMany([{
    //         rank:1,
    //         name:"Mauli",
    //         points:10
    //     },
    // {
    //         rank:2,
    //         name:"Utkarsh",
    //         points:9
    //     },{
    //         rank:3,
    //         name:"Jagdeep",
    //         points:8
    //     },{
    //         rank:4,
    //         name:"Anita",
    //         points:7
    //     },{
    //         rank:5,
    //         name:"Lata",
    //         points:6
    //     },{
    //         rank:6,
    //         name:"Meena",
    //         points:5
    //     },{
    //         rank:7,
    //         name:"Meenakshi",
    //         points:4
    //     },{
    //         rank:8,
    //         name:"Rohan",
    //         points:3
    //     },{
    //         rank:9,
    //         name:"Rahul",
    //         points:2
    //     },{
    //         rank:10,
    //         name:"Kartik",
    //         points:1
    //     }])
    //     console.log(result);
    //     const history=database.collection('history')

   
  } catch (error) {
    console.log(error);
  }
};
connectDB();

//getting leaderboard route
app.get("/users", async (req, res) => {
  try {
    const display = await user.find().sort({ points: -1 }).toArray();
    //assign ranks manually
    const usersWithRank = display.map((ele, index) => ({
      _id: ele._id,
      rank: index + 1,
      name: ele.name,
      points: ele.points,
    }));

    res.json(usersWithRank);
  } catch (error) {
    console.log(error);
  }
});

//adding user
app.post("/add", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const newUser = await user.insertOne({
      name: name,
      points: 0,
    });
    res.json({
      message: "user added successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

//claim points
app.post("/claim", async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("Incoming userId:", userId);

    const obj=new ObjectId(userId)
    console.log(obj);
    
    const userData = await user.findOne({ _id: obj });
    console.log(userData);
    
    //console.log(findpoints);

    const N = 10;
    const randomInt = Math.floor(Math.random() * N);
    const newScore = userData.points + randomInt;
    const updated = await user.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { points: newScore } }
    );
    await history.insertOne({
      name: userData.name,
      addedPoints: randomInt,
      totalPoints: newScore,
      date: new Date(),
    });

    return res.json({
      message: "Points claimed successfully",
      addedPoints: randomInt,
      newScore,
    });
  } catch (error) {
    console.log(error);
  }
});

//points history route
app.get("/history/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const display = await history
      .find({ name })
      .sort({ date: -1 })
      .toArray();

    res.json(display);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching history" });
  }
});
app.listen(port, () => {
  console.log(`server is running`);
});

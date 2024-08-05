const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const ClientModel=require('./models/Clients')
const EnvironmentModel=require('./models/Environment')
const KeyModel=require('./models/Key')


const app=express()
app.use(cors({
    origin: 'http://localhost:3000', // or whatever port your frontend is running on
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/SMARTECH")
.then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));




  app.post('/search', async (req, res) => {
    console.log('Received search request:', req.body);
  try {
    const { NameE, TypeE, NameK, URL, Configuration, TypeK } = req.body;
    
    // Build the environment search query
    const environmentQuery = {};
    if (NameE) environmentQuery.Name = { $regex: NameE, $options: 'i' };
    if (TypeE) environmentQuery.Type = { $regex: TypeE, $options: 'i' };

    // Build the key search query
    const keyQuery = {};
    if (NameK) keyQuery.Name = { $regex: NameK, $options: 'i' };
    if (URL) keyQuery.URL = { $regex: URL, $options: 'i' };
    if (Configuration) keyQuery.Configuration = { $regex: Configuration, $options: 'i' };
    if (TypeK) keyQuery.Type = { $regex: TypeK, $options: 'i' };

    console.log('Environment query:', environmentQuery);
    console.log('Key query:', keyQuery);

    // Perform the search
    const environmentResults = await EnvironmentModel.find(environmentQuery);
    const keyResults = await KeyModel.find(keyQuery);

    console.log('Environment results:', environmentResults);
    console.log('Key results:', keyResults);

    // Combine and send results
    res.json({
      environments: environmentResults,
      keys: keyResults
    });
  } catch (error) {
    console.error('Detailed search error:', error);
    res.status(500).json({ message: 'An error occurred while searching', error: error.message });
  }
});

app.get('/Dashboard/search', async (req, res) => {
    try {
      const { field, term } = req.query;
      const query = { [field]: { $regex: term, $options: 'i' } };
      const clients = await ClientModel.find(query);
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: 'Error searching clients', error });
    }
  });
  


//Fetching data functions
app.get('/Dashboard', (req,res) => {
    ClientModel.find()
    .then(clients => {
        console.log('Sending clients');
        res.json(clients);
      })
      .catch(err => {
        console.error('Error fetching clients:', err);
        res.status(500).json(err);
      });
})
//Fetching a specific instance of data(kol chay)
app.get('/Details/:id',(req,res) => {
  const id=req.params.id;
  ClientModel.findById(id)
  .populate({
    path: 'Environments',
    model: 'Environment',
    populate: {
      path: 'Keys',
      model: 'Key',
    }
  })
  .then(client => {
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    console.log('Sending clients', client);
    res.json(client);
  })
  .catch(err => {
    console.error('Error fetching clients:', err);
    res.status(500).json({ error: err.message });
  });
})

//creating a new instance
app.post('/Environments/createEnv', async (req, res) => {
  try {
      const { Name, Type, ClientId } = req.body;
      const environment = new EnvironmentModel({ Name, Type, Client: ClientId });
      await environment.save();

      // Update the client with the new environment
      await ClientModel.findByIdAndUpdate(ClientId, { $push: { Environments: environment._id } });

      res.status(201).json(environment);
  } catch (error) {
      res.status(400).json({ message: "Error creating environment", error });
  }
});


app.post('/Key/createKey', async (req, res) => {
  try {
      console.log('Received data:', req.body);
      const { Name, URL, Configuration, Type, EnvironmentId } = req.body;

      const key = new KeyModel({
          Name, 
          URL, 
          Configuration, 
          Type, 
          Environment: EnvironmentId
      });
      const savedKey = await key.save();

      // Update the environment with the new key
      await EnvironmentModel.findByIdAndUpdate(EnvironmentId, { $push: { Keys: savedKey._id } });

      res.status(201).json(savedKey);
  } catch (error) {
      console.error('Error creating key:', error);
      res.status(400).json({ message: "Error creating key", error: error.message });
  }
});

app.post("/Clients/createClient", (req,res) => {
  ClientModel.create(req.body)
  .then(clients => res.json(clients))
  .catch(err =>res.json(err))
})


//fetching a specific instance
app.get('/Environments/:id',(req,res) => {
  const id=req.params.id;
  EnvironmentModel.findById(id)
  .then(environments =>res.json(environments))
  .catch(err => res.json(err))
})

app.get('/Key/:id',(req,res) => {
  const id=req.params.id;
  KeyModel.findById(id)
  .then(keys =>res.json(keys))
  .catch(err => res.json(err))
})

app.get('/Clients/:id',(req,res) => {
  const id=req.params.id;
  ClientModel.findById(id)
  .then(clients =>res.json(clients))
  .catch(err => res.json(err))
})

//updating functions
app.put('/components/UpdateEnv/:id',(req,res) => {
  const id=req.params.id;
  EnvironmentModel.findByIdAndUpdate({_id:id}, {
      Name: req.body.Name,
      Key: req.body.Key,
      Type: req.body.Type,
      Client: req.body.Client})
      .then(environments => res.json(environments))
      .catch(err =>res.json(err))
})

app.put('/components/updateKey/:id',(req,res) => {
  const id=req.params.id;
  KeyModel.findByIdAndUpdate({_id:id}, {
      Name: req.body.Name,
      URL: req.body.URL,
      Configuration: req.body.Configuration,
      Type: req.body.Type,
      Environment: req.body.Environment})
      .then(keys => res.json(keys))
      .catch(err =>res.json(err))
})

app.put('/components/updateClient/:id',(req,res) => {
  const id=req.params.id;
  ClientModel.findByIdAndUpdate({_id:id}, {
      Name: req.body.Name,
      Code: req.body.Code,
      Contract: req.body.Contract,
      Address: req.body.Address})
      .then(clients => res.json(clients))
      .catch(err =>res.json(err))
})

//deleting data
app.delete('/Dashboard/deleteClient/:id', async (req,res) =>{
  const id =req.params.id;
  try {
    await EnvironmentModel.deleteMany({ Environment: id });
    const deletedClient = await ClientModel.findByIdAndDelete(id);

    if (!deletedClient) {
        return res.status(404).json({ message: "Client not found" });
    }

    res.json({ message: "Client and associated environments deleted successfully", deletedClient});
} catch (err) {
    res.status(500).json({ message: "Error deleting Client and environments", error: err.message });
}
});

app.delete('/Details/deleteEnvironments/:id', async (req, res) => {
  const id = req.params.id;
  try {
      await KeyModel.deleteMany({ Environment: id });
      const deletedEnvironment = await EnvironmentModel.findByIdAndDelete(id);

      if (!deletedEnvironment) {
          return res.status(404).json({ message: "Environment not found" });
      }

      res.json({ message: "Environment and associated keys deleted successfully", deletedEnvironment });
  } catch (err) {
      res.status(500).json({ message: "Error deleting environment and keys", error: err.message });
  }
});

app.delete('/Details/deleteKey/:id',(req,res) =>{
  const id =req.params.id;
  KeyModel.findByIdAndDelete({_id: id})
  .then(res => res.json(res))
  .catch(err =>res.json(err))
})
app.listen(3001,() => {
    console.log("Server is Running")
})
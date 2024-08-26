const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const ClientModel=require('./models/Clients')
const EnvironmentModel=require('./models/Environment')
const KeyModel=require('./models/Key')
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const UserModel = require('./models/user');
const { send2FACode } = require('./models/mailer');

const app = express();
const saltRounds = 10;
const JWT_SECRET = 'qsdfazerty';

app.use(express.json());
app.use(cors());

app.use(cors({
    origin: 'http://localhost:3000', // or whatever port your frontend is running on
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));app.use(express.json())
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

mongoose.connect('mongodb://127.0.0.1:27017/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await UserModel.findOne({ email });
      if (user) {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
              if (user.is2FAEnabled) {
                  // Generate and send 2FA code
                  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
                  user.twoFactorAuthToken = code;
                  user.twoFactorAuthTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry
                  await user.save();
                  await send2FACode(email, code);
                  res.status(200).json({ status: "2FA required" });
              } else {
                  const token = jwt.sign(
                      { email: user.email, userID: user._id },
                      JWT_SECRET
                  );
                  res.status(200).json({ status: "success", token });
              }
          } else {
              res.status(400).json({ error: "Incorrect password" });
          }
      } else {
          res.status(400).json({ error: "No account found with this email" });
      }
  } catch (err) {
      res.status(500).json({ error: "Server error" });
  }
});

// 2FA verification endpoint
app.post('/verify-2fa', async (req, res) => {
  const { email, twoFactorAuthToken } = req.body;

  try {
      const user = await UserModel.findOne({ email });
      if (user && user.twoFactorAuthToken === twoFactorAuthToken && user.twoFactorAuthTokenExpiry > new Date()) {
          const token = jwt.sign(
              { email: user.email, userID: user._id },
              JWT_SECRET
          );
          user.twoFactorAuthToken = null; // Clear the 2FA token after verification
          user.twoFactorAuthTokenExpiry = null;
          await user.save();
          res.status(200).json({ status: "success", token });
      } else {
          res.status(400).json({ error: "Invalid or expired 2FA code" });
      }
  } catch (err) {
      res.status(500).json({ error: "Server error" });
  }
});

// Delete user by ID
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  
  try {
      const result = await UserModel.findByIdAndDelete(userId);
      if (!result) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted' });
  } catch (error) {
      res.status(500).json({ error: 'Error deleting user' });
  }
});

// Update user by ID
app.put('/users/:id', async (req, res) => {
  try {
      const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedUser);
  } catch (error) {
      res.status(500).json({ error: 'Error updating user' });
  }
});

// Fetch all users
app.get('/users', async (req, res) => {
  try {
      const users = await UserModel.find();
      res.json(users);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
  }
});

// Update profile
app.put('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const updates = { ...req.body };
      if (updates.password) {
          updates.password = await bcrypt.hash(updates.password, saltRounds);
      }

      const user = await UserModel.findByIdAndUpdate(decoded.userID, updates, { new: true });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
  } catch (error) {
      res.status(500).json({ error: "Error updating user" });
  }
});

// Fetch user profile
app.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await UserModel.findById(decoded.userID);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
  } catch (error) {
      res.status(500).json({ error: "Error fetching user" });
  }
});

// Delete account
app.delete('/delete-account', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      await UserModel.findByIdAndDelete(decoded.userID);
      res.status(200).json({ message: "Account deleted" });
  } catch (error) {
      res.status(500).json({ error: "Error deleting account" });
  }
});

// User registration
app.post('/register', async (req, res) => {
  try {
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      const newUser = { ...req.body, password: hashedPassword };
      const user = await UserModel.create(newUser);
      res.json(user);
  } catch (err) {
      res.status(500).json(err);
  }
});

// Change password
app.put('/change-password', async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await UserModel.findById(decoded.userID);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Old password is incorrect' });

      if (newPassword !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });

      user.password = await bcrypt.hash(newPassword, saltRounds);
      await user.save();
      res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Error updating password' });
  }
});

// Profile picture upload
app.post('/upload-profile-pic', upload.single('profilePic'), async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await UserModel.findById(decoded.userID);
      if (!user) return res.status(404).json({ error: "User not found" });

      user.profilePic = `/uploads/${req.file.filename}`;
      await user.save();

      res.status(200).json({ message: "Profile picture updated", profilePic: user.profilePic });
  } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ error: "Error updating profile picture" });
  }
});



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
    const { term } = req.query;
    const query = {
      $or: [
        { Name: { $regex: term, $options: 'i' } },
        { Code: { $regex: term, $options: 'i' } },
        { Contract: { $regex: term, $options: 'i' } },
        { Address: { $regex: term, $options: 'i' } }
      ]
    };
    const clients = await ClientModel.find(query);
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error searching clients', error });
  }
});

app.get('/Details/searchEnv', async (req, res) => {
  try {
    const { clientId, term } = req.query;
    const client = await ClientModel.findById(clientId).populate('Environments');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const environmentQuery = {
      $or: [
        { Name: { $regex: term, $options: 'i' } },
        { Type: { $regex: term, $options: 'i' } }
      ]
    };

    const matchingEnvironments = client.Environments.filter(env => 
      environmentQuery.$or.some(condition => 
        new RegExp(condition[Object.keys(condition)[0]].$regex, 'i').test(env[Object.keys(condition)[0]])
      )
    );

    res.json(matchingEnvironments);
  } catch (error) {
    res.status(500).json({ message: 'Error searching environments', error });
  }
});


app.get('/Details/searchKey', async (req, res) => {
  try {
    const { clientId, environmentId, term } = req.query;
    console.log('Searching for clientId:', clientId, 'with term:', term);

    const client = await ClientModel.findById(clientId).populate({
      path: 'Environments',
      match: { _id: environmentId },
      populate: {
        path: 'Keys',
        model: 'Key',
      }
    });
    if (!client) {
      console.log('Client not found');
      return res.status(404).json({ message: 'Client not found' });
    }

    console.log('Client found:', client._id);
    console.log('Number of environments:', client.Environments.length);

    if (client.Environments.length === 0) {
      console.log('Environment not found');
      return res.status(404).json({ message: 'Environment not found' });
    }
    const environment = client.Environments[0];
    console.log('Environment:', environment._id, 'Number of keys:', environment.Keys.length);

    const keyQuery = {
      $or: [
        { Name: { $regex: new RegExp(term, 'i') } },
        { URL: { $regex: new RegExp(term, 'i') } },
        { Configuration: { $regex: new RegExp(term, 'i') } },
        { Type: { $regex: new RegExp(term, 'i') } },
      ],
    };

    const matchingKeys = environment.Keys.filter((key) =>
      keyQuery.$or.some((condition) => {
        const field = Object.keys(condition)[0];
        return new RegExp(condition[field].$regex).test(key[field]);
      })
    );

    console.log('Number of matching keys:', matchingKeys.length);
    res.json(matchingKeys);
  } catch (error) {
    console.error('Error in searchKey:', error);
    res.status(500).json({ message: 'Error searching keys', error: error.message, stack: error.stack });
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
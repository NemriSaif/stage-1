const express=require('express')
const router=express.Router()
const mongoose = require('mongoose');
const Environment = mongoose.model('Environment');
const Client = mongoose.model('Client');
const Key = mongoose.model('Key');

//getting all envs
router.get('/',async(req,res)=>{
    try{
        const environments= await Environment.find().populate('Client')
        res.json(environments)
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

//getting one env
router.get('/:id', async (req,res)=>{
    try {
        const environment = await Environment.findById(req.params.id).populate('Client')
        if (environment == null) {
            return res.status(404).json({ message: 'Environment not found' })
        }
        res.json(environment)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//creating an env
router.post('/',async(req,res)=>{
    const environment=new Environment({
        Name:req.body.Name,
        Type: req.body.Type,
        Client: req.body.ClientId
    })
    try{
        const newEnv=await environment.save()
        await Client.findByIdAndUpdate(
            req.body.ClientId,
            { $push: { Environments: newEnv._id } }
        )
        res.status(201).json(newEnv)
    }catch(err){
        res.status(400).json({message:err.message})
    }
})

//updating an env
router.patch('/:id', getEnvironments, async (req, res) => {
    try {
        if (req.body.Name != null) {
            res.environment.Name = req.body.Name;
        }
        if (req.body.Type != null) {
            res.environment.Type = req.body.Type;
        }
        if (req.body.ClientId != null) {
            // Check if the client exists
            const client = await Client.findById(req.body.ClientId);
            if (!client) {
                return res.status(400).json({ message: 'Invalid Client ID' });
            }

            // If the environment doesn't have a client or the client is changing
            if (!res.environment.Client || req.body.ClientId !== res.environment.Client.toString()) {
                // If there's an existing client, remove the environment from its array
                if (res.environment.Client) {
                    await Client.findByIdAndUpdate(
                        res.environment.Client,
                        { $pull: { Environments: res.environment._id } }
                    );
                }

                // Add environment to new client
                await Client.findByIdAndUpdate(
                    req.body.ClientId,
                    { $push: { Environments: res.environment._id } }
                );
            }

            res.environment.Client = req.body.ClientId;
        }

        const updatedEnv = await res.environment.save();
        res.json(updatedEnv);
    } catch (err) {
        console.error(err); // Log the full error for debugging
        res.status(500).json({ message: err.message });
    }
});

//deleting an env
router.delete('/:id',getEnvironments,async(req,res)=>{
    try{
        await Client.findByIdAndUpdate(
            res.environment.Client,
            {$pull:{Environments:res.environment._id}}
        )
        
        await Key.deleteMany({_id: {$in:res.environment.Keys}})

        await res.environment.deleteOne()

        res.json({message:'environment deleted'})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
async function getEnvironments(req, res, next) {
    try {
        const environment = await Environment.findById(req.params.id).populate('Client');
        if (environment == null) {
            return res.status(404).json({ message: 'Environment not found' });
        }
        res.environment = environment;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
module.exports=router;
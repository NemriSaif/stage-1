const express=require('express')
const router=express.Router()
const mongoose = require('mongoose');
const Client = mongoose.model('Client');
const Environment = mongoose.model('Environment');

//getting all the clients
router.get('/', async(req,res) =>{
    try{
        const clients=await Client.find();
        res.json(clients)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

//getting one client
router.get('/:id', getClient, (req,res)=>{
    res.send(res.client)
})

//creating a client
router.post('/', async(req,res)=>{
    const client=new Client({
        Name:req.body.Name,
        Code:req.body.Code,
        Contract:req.body.Contract,
        Address:req.body.Address
    })
    try{
        const newClient=await client.save()
        res.status(201).json(newClient)
    }catch(err){
        res.status(400).json({message:err.message})
    }
})

//updating a client

router.patch('/:id',getClient,async(req,res)=>{
    if(req.body.Name!=null){
        res.client.Name=req.body.Name
    }
    if(req.body.Code!=null){
        res.client.Code=req.body.Code
    }
    if(req.body.Address!=null){
        res.client.Address=req.body.Address
    }
    if(req.body.Name!=null){
        res.client.Name=req.body.Name
    }
    try{
        const updatedClient=await res.client.save()
        res.json(updatedClient)
    }catch(err){
        res.status(400).json({message:err.message})
    }
})

//deleting a client
router.delete('/:id', getClient, async (req, res) => {
    

    try {
        // Find all environments associated with this client
        const environments = await Environment.find({ Client: res.client._id });

        // Delete all associated environments (this will also delete associated keys)
        for (let env of environments) {
            await env.deleteOne();
        }

        // Delete the client
        await res.client.deleteOne();


        res.json({ message: "Deleted the client and all associated environments and keys" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
async function getClient(req,res, next) {
    let client;
    try{
        client= await Client.findById(req.params.id)
        if(client==null){
            return res.status(404).json({message:'cannot find client'})
        }
    }catch(err){
        return res.status(500).json({message: err.message})
    }
    res.client=client
    next()
}
module.exports = router;

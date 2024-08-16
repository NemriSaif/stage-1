const express=require('express')
const router=express.Router()
const mongoose = require('mongoose');
const Key = mongoose.model('Key');
const Environment = mongoose.model('Environment');

//getting all keys
router.get('/',async(req,res)=>{
    try{
        const keys= await Key.find().populate('Environment')
        res.json(keys)
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

//getting one key
router.get('/:id',getKeys, async(req,res)=>{
    try{
        const key=await Key.findById(req.params.id).populate('Environment')
        if(key==null){
            return res.status(404).json({message:'Key not found'})
        }
        res.json(key)
    }catch(err){
        res.status(500).json({message:err.message})
    }

})

//creating an key
router.post('/',async(req,res)=>{
    try{
    const key=new Key({
        Name:req.body.Name,
        URL:req.body.URL,
        Configuration:req.body.Configuration,
        Type: req.body.Type,
        Environment: req.body.EnvironmentId
    })
    
        const newKey=await key.save()

        await Environment.findByIdAndUpdate(
            req.body.EnvironmentId,
            {$push:{Keys:newKey._id}}
        )
        res.status(201).json(newKey)
    }catch(err){
        res.status(400).json({message:err.message})
    }
})

//updating an key
router.patch('/:id',getKeys, async(req,res)=>{
    try{
    if(req.body.Name!=null){
        res.key.Name=req.body.Name
    }
    if(req.body.URL!=null){
        res.key.URL=req.body.URL
    }
    if(req.body.Configuration!=null){
        res.key.Configuration=req.body.Configuration
    }
    if(req.body.Type!=null){
        res.key.Type=req.body.Type
    }
    if(req.body.EnvironmentId!=null){
        const environment=await Environment.findById(req.body.EnvironmentId)
        if(!environment){
            return res.status(400).json({message:'invalid client ID'})
        }
        if(!res.key.Environment || req.body.EnvironmentId!==res.environment._id)
        {
            if(res.key.Environment){
                await Environment.findByIdAndUpdate(
                    res.key.Environment,
                    {$pull:{Keys :res.key._id}}
                )
            }
            await Environment.findByIdAndUpdate(
                req.body.EnvironmentId,
                {$push:{Keys:res.key._id}}
            )
        }
        res.key.Environment=req.body.EnvironmentId
    }
    
        const updatedKey=await res.key.save()
        res.json(updatedKey)
    }catch(err){
        console.error(err); 
        res.status(400).json({message:err.message})
    }
})

//deleting an key
router.delete('/:id',getKeys,async(req,res)=>{
    try{
        await res.key.deleteOne()
        res.json({message:'key deleted'})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
async function getKeys(req,res,next){
    let key;
    try{
        key=await Key.findById(req.params.id).populate('Environment')
        if(key==null){
            return res.status(404).json({message:'key not found'})
        }
    }catch(err){
        return res.status(500).json({message:err.message})
    }
    res.key=key
    next()
}

module.exports=router;
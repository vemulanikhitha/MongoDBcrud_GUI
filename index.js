const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const brand = require('./models/Brand')
const Brand = require('./models/Brand')
const app = express();
const port = 3000;
//MongoDB connection
mongoose.connect('mongodb://localhost:27017/branddb')
.then(()=>console.log('Connected to DB'))
.catch(err=>console.log('Error connecting to MongoDB',err))
//Middleware 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));//for serving static css file in public
app.set('view engine','ejs');
//Routes
//home page
app.get('/',async (req,res)=>{
    try{
        const brands = await Brand.find();
        res.render('index',{brands})

    }
    catch(err){
        console.log(err);
        res.status(500).send('server error')


    }

})
//Add new brand
app.post('/add', async (req,res)=>{
    try{
        const newBrand = new Brand({
            name:req.body.name,
            description:req.body.description
        })
        await newBrand.save()
        res.redirect('/')

    }
    catch(err){
        console.log(err)
res.status(500).send('Error adding brand');
    }
})
//Edit with brand page
app.get('/edit/:id', async (req,res)=>{
    try{
        const brand = await Brand.findById(req.params.id); //params==== urls === pages
        if (!brand) return res.status(404).send('Brand not found');
        res.render('edit',{brand})
    }
    catch(err){
        console.log(err);
        res.status(500).send('Server error')
    }
})
app.post('/edit/:id',async (req,res)=>{
    try{
        await Brand.findByIdAndUpdate(req.params.id,req.body);
        res.redirect('/')
    }catch(err){
        console.log(err)
        res.status(500).send('Error updating brand')
    }
})
app.post('/delete/:id',async (req,res)=>{
    try{
        await Brand.findByIdAndDelete(req.params.id)
        res.redirect('/')
    }
    catch(err){
        console.log(err)
        res.status(500).send('Error deleting brand')
    }
})
app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}`)
})
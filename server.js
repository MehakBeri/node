//learnt from: https://medium.com/@debug_mode/step-by-step-building-node-js-based-rest-api-to-perform-crud-operations-on-mongodb-ab18835111d7

//import required modules
var express= require('express');
var bodyParser = require('body-parser');
var cors= require('cors');
var app= express();
var mongoose = require('mongoose');
var product= require('./product');

//create route, assign port and use body parser to parse incoming json data

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
var port = process.env.PORT || 8090;
var router = express.Router();

//conect to mongo db server
mongoose.connect('mongodb://localhost:27017/products');
router.use(function(req,res,next){
	//do logging
	//do authentication
	console.log('logging of request shall be done here');
	next(); //make sure we go to the next routes and dont stop here
});
//this route shall be called whenever client performs http post operation
router.route('/products').post(function(req,res){
	console.log("in add");
	var p= new product();
	p.title= req.body.title;
	p.price= req.body.price;
	p.instock = req.body.instock;
	p.photo=req.body.photo;
	p.save(function(err){
		if(err){
			res.send(err);
		}
		console.log('added');
		res.send({message: 'Product Created!'})
	});
});
//add get operation to fetch records
router.route('/products').get(function(req,res){
	product.find(function(err,products){
		if(err){
			res.send(err);
		}
		res.send(products);
	});
});
//to return a particular record on the basis of product id
router.route('/products/:product_id').get(function(req,res){
	product.findById(req.params.product_id,function(err,prod){
		if(err)
		{
			res.send(err);
		}
		res.json(prod);
	});
});
//to update record - put request
router.route('/products/:product_id').put(function(req,res){
	product.findById(req.params.product_id,function(err,prod){
		if(err)
			res.send(err);
		prod.title=req.body.title;
		prod.price=req.body.price;
		prod.instock=req.body.instock;
		prod.photo=req.body.photo;
		prod.save(function(err){
			if(err)
				res.send(err);
			res.json({message:'Product updated!'});
		});
	});
});
//to delete
router.route('/products/:product_id').delete(function(req,res){
	product.remove({_id:req.params.product_id},function(err,prod){
		if(err)
			res.send(err);
		res.json({message:'Successfully deleted'});
	});
});

//enable cors support, configure port for api, configure that rest api be created on baseurl/api/{routename}

app.use(cors());
app.use('/api',router);
app.listen(port);
console.log('REST API is running at '+port);
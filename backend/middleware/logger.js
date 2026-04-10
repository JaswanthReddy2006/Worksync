const logger=(req,res,next)=>{
    console.log('Logging...');
    console.log(`${req.method} ${req.url}`);
    next();
}
module.exports=logger;
exports.test = (req, res, next) => {

  console.log(req.userId);
  const body = req.body;
  console.log("********* "+req.body);

  if(req.body.num ==1){
    return res.status(200).json({
      status: "success from login",
      comment: "success",
      data: null,
    });

  }else{
    return res.status(500).json({
      status: "failed from login",
      comment: "failed",
      data: null,
    });

  }

   
      
}

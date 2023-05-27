const Insurance= require("../models/insuranceModel")

const insuranceSignInController = async(req,res)=>{
    const { email, password } = req.body;
    const insurance= await Insurance.findOne({ email });
    if (insurance) {
      if (password === insurance.password) {
        res.status(200).json({ status:"success", message: "Login Sucess" ,role:"insurance", id:insurance.id});
      } else {
        res.status(400).json({status:"failed", message: "Invalid Password" });
      }
    } else {
      res.status(400).json({status:"failed", message: "Invalid Email" });
    }
}

const insuranceSignOutController = async (req,res)=>{

}

const insuranceViewProfileController = async(req,res)=>{

}

const insuranceViewPolicyClaimsController = async(req,res)=>{

}

const insuranceViewPolicyClaimsDataController = async(req,res)=>{

}

const viewPolicyClaimsDataController = async(req,res)=>{

}

const insuranceRejectController = async(req,res)=>{

}

const insuranceAcceptController = async(req,res)=>{

}

const insuranceViewPolicyController = async(req,res)=>{

}

module.exports ={
    insuranceAcceptController,
    insuranceRejectController,
    insuranceViewPolicyController,
    insuranceAcceptController,
    insuranceViewProfileController,
    insuranceSignInController,
    insuranceSignOutController,
    insuranceViewPolicyClaimsController,
    insuranceViewPolicyClaimsDataController,
    viewPolicyClaimsDataController
}

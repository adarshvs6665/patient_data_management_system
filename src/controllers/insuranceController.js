const Insurance= require("../models/insuranceModel")

const insuranceSignInController = async(req,res)=>{
    const { email, password } = req.body;
    const insurance= await Insurance.findOne({ email });
    if (insurance) {
      if (password === insurance.password) {
        res.json({ message: "Login Sucess" });
      } else {
        res.json({ message: "Invalid Password" });
      }
    } else {
      res.json({ message: "Invalid Email" });
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

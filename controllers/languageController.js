import MasterLanguage from "../models/masterLanguageModel.js"

export const getLanguageList = async(req,res)=>{
    const data = await MasterLanguage.findAll()
    return res.status(200).json({
        data
    }) 
}
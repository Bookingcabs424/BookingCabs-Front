import MasterWorkingShift from "../models/masterWorkingShit.js"

export const getWorkingShiftList=async(req,res)=>{
    const data = await MasterWorkingShift.findAll()
    return res.status(200).json({
        data
    })
}
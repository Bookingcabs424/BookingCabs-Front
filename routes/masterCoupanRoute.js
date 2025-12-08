import express from "express";

import MasterCouponController from "../controllers/masterCoupanController.js";

const coupanRouter = express.Router();


coupanRouter.post("/coupan-type/add", MasterCouponController.addCoupanType);
coupanRouter.get("/coupan-type/all", MasterCouponController.getAllCoupanTypes);

coupanRouter.post("/coupan-type/update-coupon-type", MasterCouponController.updateCouponType)
coupanRouter.delete("/coupan-type/delete", MasterCouponController.deleteCouponTypes)



coupanRouter.post('/get-coupons', MasterCouponController.getCoupons);
coupanRouter.post('/add-coupon', MasterCouponController.addCoupan);
coupanRouter.post('/update-coupon', MasterCouponController.updateCoupon);
coupanRouter.delete("/delete", MasterCouponController.deleteCoupons);



coupanRouter.get('/coupon-validate', MasterCouponController.couponValidate);
coupanRouter.get('/coupon-validation', MasterCouponController.couponValidation);


export default coupanRouter;
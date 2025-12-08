select `u`.`id` AS `id`,`u`.`first_name` AS `first_name`,`u`.`last_name` AS `last_name`,
`u`.`mobile` AS `mobile`,`u`.`mobile_prefix` AS `mobile_prefix`,`u`.`email` AS `email`,
`u`.`city` AS `city`,`u`.`user_type_id` AS `user_type_id`,`u`.`nationality` AS `nationality`,
`u`.`isActive` AS `isActive`,`u`.`modified_by` AS `modified_by`,`u`.`referral_key` AS `referral_key`,
`u`.`accept_fare` AS `accept_fare`,`u`.`newsletter_subscription` AS `newsletter_subscription`,
`u`.`agreement_subscription` AS `agreement_subscription`,`u`.`email_verified` AS `email_verified`,
`u`.`mobile_verfication` AS `mobile_verfication`,`u`.`parent_id` AS `parent_id`,`u`.`username` AS `username`,
`u`.`active_by` AS `active_by`,`u`.`company_id` AS `company_id`,`u`.`created_date` AS `created_date`,
`u`.`duty_status` AS `duty_status`,`u`.`gcm_id` AS `gcm_id`,`u`.`login_otp_status` AS `login_otp_status`,
`u`.`login_status` AS `login_status`,`u`.`login_time` AS `login_time`,`u`.`login_timezone` AS `login_timezone`,
`u`.`logout_time` AS `logout_time`,`u`.`mobile_promotion` AS `mobile_promotion`,`u`.`refer_by` AS `refer_by`,
`u`.`signup_status` AS `signup_status`,`u`.`updated_date` AS `updated_date`,`u`.`user_grade` AS `user_grade`,
`u`.`wallet_point` AS `wallet_point`,`ui`.`address` AS `address`,`ui`.`address2` AS `address2`,
`ui`.`alternate_email` AS `alternate_email`,`ui`.`alternate_mobile` AS `alternate_mobile`,
`ui`.`external_ref` AS `external_ref`,`ui`.`city_id` AS `city_id`,`ui`.`country_id` AS `country_id`,
`ui`.`dob` AS `dob`,`ui`.`father_name` AS `father_name`,`ui`.`gst_registration_number` AS `gst_registration_number`
,`ui`.`kyc` AS `kyc`,`ui`.`kyc_type` AS `kyc_type`,`ui`.`landline_number` AS `landline_number`,`ui`.`pincode` AS `pincode`,
`ui`.`state_id` AS `state_id`,`ui`.`gender` AS `gender`,`u`.`user_profile_path` AS `user_profile_path`,`mc`.`name` AS `city_name`,
`ms`.`name` AS `state_name`,`mcn`.`name` AS `country`,
(select group_concat(`mdt`.`document_name` separator ',') 
from `bookingcab_test`.`master_document_type` `mdt` 
where exists(select 1 from `bookingcab_test`.`user_upload_document`
`uud` where ((`uud`.`document_type_id` = `mdt`.`doc_type_id`) and 
(`uud`.`user_id` = `u`.`id`))) is false) AS `pending_doc`,
`rl`.`role_name` AS `user_type` from (((((`bookingcab_test`.`user` `u`
     left join `bookingcab_test`.`user_info` `ui` on((`u`.`id` = `ui`.`user_id`))) 
     left join `bookingcab_test`.`master_city` `mc` on((`mc`.`id` = `ui`.`city_id`))) 
     left join `bookingcab_test`.`master_state` `ms` on((`ms`.`id` = `ui`.`state_id`))) 
     left join `bookingcab_test`.`master_country` `mcn` on((`mcn`.`id` = `u`.`nationality`))) 
     left join `bookingcab_test`.`user_role` `rl` on((`rl`.`role_id` = `u`.`user_type_id`))) where (`u`.`isDeleted` = 0)
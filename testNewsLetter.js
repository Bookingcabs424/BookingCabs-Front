import User from './models/userModel.js';
import NewsletterUser from './models/newsletteruserModel.js';
import sequelize from './config/clientDbManager.js';



export const syncUsersToNewsletter = async () => {
  try {
    console.log("🚀 Starting newsletter sync with city + user_info data...");

    const [users] = await sequelize.query(`
      SELECT 
        u.id AS user_id,
        u.company_id,
        u.user_type_id,
        u.first_name,
        u.last_name,
        u.email,
        u.mobile,
        u.city AS city_id,
        c.name AS city_name,
        f.address,
        f.pincode,
        u.created_by
      FROM user AS u
      LEFT JOIN master_city AS c ON u.city = c.id
      LEFT JOIN user_info AS f ON f.user_id = u.id
    `);

    if (!users.length) {
      console.log("⛔ No users found.");
      return;
    }

    for (const user of users) {

      const exists = await NewsletterUser.findOne({
        where: { email: user.email }
      });

      if (exists) {
        console.log(`⚠️ Already exists → ${user.email}`);
        continue;
      }

      if(!user.user_id){
        continue;
      }

      await NewsletterUser.create({
        company_id: user.company_id || null,
        campaign_id: null,
        source: "User Table",
        user_id: user.user_id,  
        user_type_id: user.user_type_id || null,
        first_name: user.first_name || null,
        last_name: user.last_name || null,
        email: user.email || null,
        mobile: user.mobile || null,
        city_id: user.city_id || null,
        city_name: user.city_name || null,
        address: user.address || null,
        pin_code: user.pincode || null,
        email_subscription: "Active",
        mobile_subscription: "Active",
        unsubscribe_reason: null,
        created_date: new Date(),
        created_by: user.created_by || 1,
        modified_by: null,
        modified_date: new Date(),
        status: "Active",
        ip: "127.0.0.1"
      });

      console.log(`✅ Inserted → ${user.email}`);
    }

    console.log("🎉 Sync completed successfully!");

  } catch (err) {
    console.error("❌ Error syncing:", err);
  } finally {
    await sequelize.close();
  }
};

syncUsersToNewsletter()
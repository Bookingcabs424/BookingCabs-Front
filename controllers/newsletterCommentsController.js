import NewsletterComment from "../models/newsletterCommentsModel.js";
import NewsletterUser from "../models/newsletteruserModel.js"; // for join if needed
import sequelize from "../config/clientDbManager.js";


export const createNewsletterComment = async (req, res) => {
  try {
    const { newsletter_id, comment } = req.body;

    if (!newsletter_id || !comment) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const newComment = await NewsletterComment.create({
      newsletter_id,
      user_id: req.user.id,
      comment,
      created_by: req.user.id,
      created_date: new Date(),
    });

    res.status(201).json({
      message: "Comment created successfully",
      data: newComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// export const getCommentsByNewsletterId = async (req, res) => {
//   try {
//     const { newsletter_id } = req.params;
//     console.log(newsletter_id);

//     let sql = `
//     SELECT nc.*,
//     u.first_name,
//     u.last_name
//     FROM newsletter_comments nc
//     LEFT JOIN users ON u.id = nc.user_id
//     `

//     const comments = await NewsletterComment.findAll({
//       where: { newsletter_id },
//       //   include: {
//       //     model: NewsletterUser,
//       //     as: "newsletter",
//       //     attributes: ["id", "first_name", "last_name", "email"],
//       //   },
//       //   order: [["created_date", "DESC"]],
//     });

//     res.status(200).json({ data: comments });
//   } catch (error) {
//     console.error("Error fetching comments by newsletter:", error);
//     res.status(500).json({ message: "Internal Server Error", error });
//   }
// };

export const getCommentsByNewsletterId = async (req, res) => {
  try {
    const { newsletter_id } = req.params;

    if (!newsletter_id) {
      return res.status(400).json({ message: "Newsletter ID required" });
    }

    const sql = `
      SELECT 
        nc.*,
        u.first_name,
        u.last_name
      FROM newsletter_comments nc
      LEFT JOIN user u ON u.id = nc.user_id
      WHERE nc.newsletter_id = :newsletter_id
      ORDER BY nc.created_date DESC
    `;

    const comments = await sequelize.query(sql, {
      replacements: { newsletter_id },
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({ data: comments });
  } catch (error) {
    console.error("Error fetching comments by newsletter:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getNewsletterCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await NewsletterComment.findOne({
      where: { id },
      include: {
        model: NewsletterUser,
        as: "newsletter",
        attributes: ["id", "first_name", "last_name", "email"],
      },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ data: comment });
  } catch (error) {
    console.error("Error fetching comment:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const updateNewsletterComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, modified_by } = req.body;

    const commentData = await NewsletterComment.findByPk(id);

    if (!commentData) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await commentData.update({
      comment,
      modified_by,
      modified_date: new Date(),
    });

    res.status(200).json({
      message: "Comment updated successfully",
      data: commentData,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const deleteNewsletterComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await NewsletterComment.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

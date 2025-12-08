// import EmailTemplate from "../models/emailTemplateModel.js";

// // export const createEmailTemplate = async (req, res) => {
// //   try {
// //     let payload = {
// //       name: req.body.name,
// //       subject: req.body.subject,
// //       body: req.body.body,
// //       variables: req.body.variables,
// //       type: req.body.type,
// //       description: req.body.description,
// //       isDeleted: false,
// //     };

// //     const created = await EmailTemplate.create(payload);

// //     return res.status(201).json({ success: true, data: created });
// //   } catch (error) {
// //     console.log(error);
// //     return res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };

// export const createEmailTemplate = async (req, res) => {
//   try {
//     const userId = req.user?.id || 1;           // or take from auth middleware
//     const companyId = req.user?.company_id || 1;

//     let payload = {
//       name: req.body.name,
//       subject: req.body.subject ?? "",
//       body: req.body.body ?? "",
//       variables: req.body.variables ?? null,
//       type: req.body.type ?? "MASTER",

//       // HTML content from the editor
//       description: req.body.description,

//       // required by your model
//       company_id: companyId,
//       img: req.body.img ?? "",        // or some default, if you don't use it yet
//       created_by: userId,
//       modified_by: userId,

//       is_active: false,
//       ip: req.ip || "",
//     };

//     const created = await EmailTemplate.create(payload);

//     return res.status(201).json({ success: true, data: created });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export const updateEmailTemplate = async (req, res) => {
//   try {
//     let payload = {
//       name: req.body.name,
//       subject: req.body.subject,
//       body: req.body.body,
//       variables: req.body.variables,
//       type: req.body.type,
//       description: req.body.description,
//     };

//     await EmailTemplate.update(payload, { where: { id: req.params.id } });

//     return res.json({ success: true, message: "Updated successfully" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false });
//   }
// };




// export const softDeleteEmailTemplate = async (req, res) => {
//   try {
//     let payload = { is_active: true };

//     await EmailTemplate.update(payload, { where: { id: req.params.id } });

//     return res.json({ success: true, message: "Soft deleted" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false });
//   }
// };

// export const getAllEmailTemplates = async (req, res) => {
//   try {
//     const templates = await EmailTemplate.findAll(
//       // { 
//         // where:
//         //  { isDeleted: false }
//       //  }
//       );
//     return res.json({ success: true, data: templates });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false });
//   }
// };

// export const getEmailTemplateById = async (req, res) => {
//   try {
//     const template = await EmailTemplate.findOne({ where: { id: req.params.id, isDeleted: false } });
//     if (!template) {
//       return res.status(404).json({ success: false, message: "Template not found" });
//     }
//     return res.json({ success: true, data: template });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false });
//   }
// };



import EmailTemplate from "../models/emailTemplateModel.js";

/**
 * Create template
 */
export const createEmailTemplate = async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const companyId = req.user?.company_id || 1;

    const payload = {
      name: req.body.name,
      subject: req.body.subject ?? "",
      body: req.body.body ?? "",
      variables: req.body.variables ?? null,
      type: req.body.type ?? "MASTER",
      description: req.body.description,     // HTML from editor
      company_id: companyId,
      img: req.body.img ?? "",
      header_text: req.body.header_text ?? "",
      footer_text: req.body.footer_text ?? "",
      created_by: userId,
      modified_by: userId,
      ip: req.ip || "",
      isActive: true,                        // new templates are active by default
    };

    const created = await EmailTemplate.create(payload);
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Update template
 */
// export const updateEmailTemplate = async (req, res) => {
//   try {
//     const payload = {
//       name: req.body.name,
//       subject: req.body.subject,
//       body: req.body.body,
//       variables: req.body.variables,
//       type: req.body.type,
//       description: req.body.description,
//       header_text: req.body.header_text,
//       footer_text: req.body.footer_text,
//     };

//     await EmailTemplate.update(payload, { where: { id: req.params.id } });
//     return res.json({ success: true, message: "Updated successfully" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export const updateEmailTemplate = async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      subject: req.body.subject,
      body: req.body.body,
      variables: req.body.variables,
      type: req.body.type,
      description: req.body.description,
      header_text: req.body.header_text,
      footer_text: req.body.footer_text,
      // add this:
      ...(req.body.isActive !== undefined && { isActive: req.body.isActive }),
    };

    await EmailTemplate.update(payload, { where: { id: req.params.id } });
    return res.json({ success: true, message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
/**
 * Soft delete (toggle inactive)
 */
// export const softDeleteEmailTemplate = async (req, res) => {
//   try {
//     await EmailTemplate.update(
//       { isActive: false },
//       { where: { id: req.params.id } }
//     );
//     return res.json({ success: true, message: "Soft deleted" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export const softDeleteEmailTemplate = async (req, res) => {
  try {
    const { isActive } = req.body;
    await EmailTemplate.update(
      { isActive: isActive ?? false },
      { where: { id: req.params.id } }
    );
    return res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




/**
 * Fetch active templates
 */
// export const getAllEmailTemplates = async (req, res) => {
//   try {
//     const templates = await EmailTemplate.findAll({
//       where: { isActive: true },
//       order: [["id", "DESC"]],
//     });
//     return res.json({ success: true, data: templates });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export const getAllEmailTemplates = async (req, res) => {
  try {
    const { includeInactive, status } = req.query;
    const whereClause =
      status === "inactive"
        ? { isActive: false }
        : includeInactive === "true"
        ? {}
        : { isActive: true };

    const templates = await EmailTemplate.findAll({
      where: whereClause,
      order: [["id", "DESC"]],
    });

    return res.json({ success: true, data: templates });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
/**
 * Fetch one template (active only)
 */
export const getEmailTemplateById = async (req, res) => {
  try {
    const template = await EmailTemplate.findOne({
      where: { id: req.params.id, isActive: true },
    });
    if (!template) {
      return res
        .status(404)
        .json({ success: false, message: "Template not found" });
    }
    return res.json({ success: true, data: template });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



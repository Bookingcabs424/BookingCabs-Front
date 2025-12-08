import ejs from "ejs";
import { getEmailTemplate } from "../models/emailTemplateModel.js";

/**
 * Renders an email template with dynamic parameters.
 *
 * @param {string} template_name - The name of the email template (used to fetch from DB)
 * @param {object} template_param - An object containing dynamic values (e.g. { name: "John" })
 * @returns {Promise<{ html: string, text: string }>} - Rendered HTML and plain text
 */
export const renderEmailTemplate = async (
  template_type,
  template_param = {},
  show_header_footer = true
) => {
  try {
    const template = await getEmailTemplate(template_type);
    // console.log(template);
    if (!template) {
      throw new Error(`Template "${template_type}" not found.`);
    }

    const header = template.header_text || "";
    const body = template.description || "";
    const footer = template.footer_text || "";

    let combinedHTML = ``;

    if (show_header_footer == true) {
      combinedHTML = `${header}${body}${footer}`;
    } else {
      combinedHTML = `${body}`;
    }
    const html = ejs.render(combinedHTML, template_param);
    const text = ejs.render(template.text_content || "", template_param);

    return { html, text };
  } catch (err) {
    throw new Error(`Failed to render email template: ${err.message}`);
  }
};

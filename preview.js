import ejs from "ejs";
import path from "path";
import open from "open";
import fs from "fs";

async function renderPreview() {
  try {
    const templatePath = path.join(process.cwd(), "views", "Dhanteras_Email.ejs");

    const params = {
      name: "Govind",
      subscribeUrl: "https://example.com/subscribe",
      unsubscribeUrl: "https://example.com/unsubscribe",
    };

    // Render HTML
    const html = await ejs.renderFile(templatePath, params);

    // Write temporary HTML file
    const tmpFile = path.join(process.cwd(), "preview.html");
    fs.writeFileSync(tmpFile, html, "utf8");

    console.log("✅ Preview file generated at:", tmpFile);

    // Open in default browser
    await open(tmpFile);
  } catch (err) {
    console.error("❌ Error rendering preview:", err);
  }
}

renderPreview();

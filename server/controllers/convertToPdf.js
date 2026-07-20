const { exec } = require("child_process");
const path = require("path");

const LO_COMMAND = "soffice";
// const oficcePath = process.env.OFFICE_PATH || "C:\\Program Files\\LibreOffice\\program\\soffice.exe";
const oficcePath = process.env.OFFICE_PATH || "soffice";
/**
 * Convierte un archivo Word (.doc o .docx) a PDF
 * @param {string} inputPath - ruta absoluta del archivo Word
 * @returns {Promise<string>} - ruta absoluta del PDF generado
 */
const convertirWordAPdf = (inputPath) => {
  return new Promise((resolve, reject) => {
    const ext = path.extname(inputPath).toLowerCase();
    
    // Si ya es un PDF, no es necesario convertir
    if (ext === ".pdf") {
      return resolve(inputPath);
    }

    const outputDir = path.dirname(inputPath); // misma carpeta de salida
    // const command = `${LO_COMMAND} --headless --convert-to pdf "${inputPath}" --outdir "${outputDir}"`;
        const command = `"${oficcePath}" --headless --convert-to pdf "${inputPath}" --outdir "${outputDir}"`;

    exec(command, (error) => {
      if (error) {
        console.error("Error al convertir a PDF:", error);
        reject(error);
      } else {
        // Formar la ruta del PDF generado
        const parsedPath = path.parse(inputPath);
        const pdfPath = path.join(outputDir, parsedPath.name + ".pdf");
        resolve(pdfPath);
      }
    });
  });
};

module.exports = convertirWordAPdf;

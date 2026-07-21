const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("☁️ Cloudinary configurado correctamente.");
} else {
  console.warn("⚠️ Advertencia: Variables de Cloudinary no encontradas. Usando almacenamiento local por defecto.");
}

/**
 * Crea un engine de almacenamiento Multer (Cloudinary o Local Fallback)
 */
const createStorage = (folderName, localDir, isRaw = false) => {
  if (isCloudinaryConfigured) {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const sanitizedName = path.parse(file.originalname).name
          .trim()
          .replace(/\s+/g, "_");
        const timestamp = Date.now();

        // Si es un archivo PDF, usar resource_type "image" y format "pdf" para evitar bloqueos 401 de raw
        if (ext === ".pdf") {
          return {
            folder: `classroom/${folderName}`,
            resource_type: "image",
            format: "pdf",
            access_mode: "public",
            public_id: `${timestamp}_${sanitizedName}`,
          };
        }

        if (isRaw) {
          return {
            folder: `classroom/${folderName}`,
            resource_type: "raw",
            access_mode: "public",
            public_id: `${timestamp}_${sanitizedName}${ext}`,
          };
        }

        return {
          folder: `classroom/${folderName}`,
          resource_type: "auto",
          access_mode: "public",
          public_id: `${timestamp}_${sanitizedName}`,
        };
      },
    });
  } else {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        if (!fs.existsSync(localDir)) {
          fs.mkdirSync(localDir, { recursive: true });
        }
        cb(null, localDir);
      },
      filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const sanitizedName = file.originalname
          .replace(ext, "")
          .trim()
          .replace(/\s+/g, "_");
        cb(null, `${sanitizedName}_${timestamp}${ext}`);
      },
    });
  }
};

const storagePerfil = createStorage("img/perfil", "uploads/img/perfil", false);
const storageAlumnos = createStorage("img/alumnosCursos", "uploads/img/alumnosCursos", false);
const storageCursos = createStorage("img/cursos", "uploads/img/cursos", false);
const storageMaterial = createStorage("docs/temp", "uploads/docs/temp", true);
const storagePlan = createStorage("docs/planes", "uploads/docs/planes", true);

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadPerfil: multer({ storage: storagePerfil }),
  uploadAlumnos: multer({ storage: storageAlumnos }),
  uploadCursos: multer({ storage: storageCursos }),
  uploadMaterial: multer({ storage: storageMaterial }),
  uploadPlan: multer({ storage: storagePlan }),
};

// SAHYAK CRM - Media & File Management Service
// Real frontend-compatible file validation, client-side canvas compression, and metadata storage

export interface MediaValidationResult {
  isValid: boolean;
  error?: string;
  fileType: "image" | "video" | "pdf" | "document" | "unsupported";
  fileSizeFormatted: string;
}

export interface CompressionResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
  width: number;
  height: number;
}

export interface MediaMetadata {
  id: string;
  name: string;
  size: number;
  sizeFormatted: string;
  type: "image" | "video" | "pdf" | "document";
  mimeType: string;
  url: string;
  originalSize?: number;
  compressedSize?: number;
  reductionPercentage?: number;
  uploadedAt: string;
  entityType?: "project" | "product" | "template";
  entityId?: string;
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_PDF_SIZE = 15 * 1024 * 1024;   // 15MB
const MAX_DOC_SIZE = 10 * 1024 * 1024;   // 10MB

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const ALLOWED_PDF_TYPES = ["application/pdf"];
const ALLOWED_DOC_TYPES = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const DANGEROUS_EXTENSIONS = [
  ".exe", ".bat", ".cmd", ".sh", ".bin", ".dll", ".app", ".vbs", ".js", ".mjs", ".ts",
];

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function validateFile(file: File): MediaValidationResult {
  const fileName = file.name.toLowerCase();
  const fileSize = file.size;
  const mimeType = file.type.toLowerCase();
  const formattedSize = formatFileSize(fileSize);

  // Check dangerous file extensions
  for (const ext of DANGEROUS_EXTENSIONS) {
    if (fileName.endsWith(ext)) {
      return {
        isValid: false,
        error: `Executable or script files (${ext}) are prohibited for security reasons.`,
        fileType: "unsupported",
        fileSizeFormatted: formattedSize,
      };
    }
  }

  // Determine file type category
  if (ALLOWED_IMAGE_TYPES.includes(mimeType) || /\.(jpe?g|png|webp|svg)$/i.test(fileName)) {
    if (fileSize > MAX_IMAGE_SIZE) {
      return {
        isValid: false,
        error: `Image exceeds maximum allowed limit of 10MB (Current: ${formattedSize}). Please select a smaller photo or optimize it before uploading.`,
        fileType: "image",
        fileSizeFormatted: formattedSize,
      };
    }
    return { isValid: true, fileType: "image", fileSizeFormatted: formattedSize };
  }

  if (ALLOWED_VIDEO_TYPES.includes(mimeType) || /\.(mp4|webm)$/i.test(fileName)) {
    if (fileSize > MAX_VIDEO_SIZE) {
      return {
        isValid: false,
        error: `Video exceeds maximum upload limit of 50MB (Current: ${formattedSize}). In-browser video compression is not supported without heavy external processing. Please use an optimized MP4 or external video URL.`,
        fileType: "video",
        fileSizeFormatted: formattedSize,
      };
    }
    return { isValid: true, fileType: "video", fileSizeFormatted: formattedSize };
  }

  if (ALLOWED_PDF_TYPES.includes(mimeType) || fileName.endsWith(".pdf")) {
    if (fileSize > MAX_PDF_SIZE) {
      return {
        isValid: false,
        error: `PDF brochure exceeds maximum allowed limit of 15MB (Current: ${formattedSize}). Please compress the PDF document using standard tools prior to upload.`,
        fileType: "pdf",
        fileSizeFormatted: formattedSize,
      };
    }
    return { isValid: true, fileType: "pdf", fileSizeFormatted: formattedSize };
  }

  if (ALLOWED_DOC_TYPES.includes(mimeType) || /\.(docx?|txt)$/i.test(fileName)) {
    if (fileSize > MAX_DOC_SIZE) {
      return {
        isValid: false,
        error: `Document exceeds limit of 10MB (Current: ${formattedSize}).`,
        fileType: "document",
        fileSizeFormatted: formattedSize,
      };
    }
    return { isValid: true, fileType: "document", fileSizeFormatted: formattedSize };
  }

  return {
    isValid: false,
    error: `Unsupported file format "${file.type || fileName.split(".").pop()}". Supported formats: JPG, PNG, WEBP, SVG, MP4, WEBM, and PDF.`,
    fileType: "unsupported",
    fileSizeFormatted: formattedSize,
  };
}

/**
 * Real client-side image compression using HTML5 Canvas
 * Scales images down if dimension exceeds maxDimension (default 1600px)
 * Applies JPEG/WebP compression with quality factor (default 0.78)
 */
export async function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.78
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    // If SVG, do not run through canvas rasterization to maintain vector sharpness
    if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve({
          dataUrl,
          originalSize: file.size,
          compressedSize: file.size,
          reductionPercentage: 0,
          width: 800,
          height: 600,
        });
      };
      reader.onerror = () => reject(new Error("Failed to read SVG file."));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Scale down proportionally if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to create canvas 2D context for image compression."));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG or WebP
        const outputMime = file.type === "image/png" ? "image/jpeg" : file.type;
        const compressedDataUrl = canvas.toDataURL(outputMime, quality);

        // Calculate actual compressed byte length
        const head = `data:${outputMime};base64,`;
        const base64Data = compressedDataUrl.substring(head.length);
        const compressedBytes = Math.round((base64Data.length * 3) / 4);

        const reduction = Math.max(
          0,
          parseFloat((((file.size - compressedBytes) / file.size) * 100).toFixed(1))
        );

        resolve({
          dataUrl: compressedDataUrl,
          originalSize: file.size,
          compressedSize: compressedBytes,
          reductionPercentage: reduction,
          width,
          height,
        });
      };
      img.onerror = () => reject(new Error("Failed to parse image for canvas compression."));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read image file from disk."));
    reader.readAsDataURL(file);
  });
}

// --- Local Storage Media Metadata Handler ---
const MEDIA_META_STORAGE_KEY = "sahyak_crm_media_meta_v1";

export function getStoredMediaMetadata(): MediaMetadata[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(MEDIA_META_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore
    }
  }
  return [];
}

export function saveMediaMetadata(meta: MediaMetadata): MediaMetadata[] {
  const current = getStoredMediaMetadata();
  const updated = [meta, ...current.filter((m) => m.id !== meta.id)];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(MEDIA_META_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  }
  return updated;
}

export function deleteMediaMetadata(id: string): MediaMetadata[] {
  const current = getStoredMediaMetadata();
  const updated = current.filter((m) => m.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(MEDIA_META_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  }
  return updated;
}

export async function createAttachmentFromFile(
  file: File,
  userDefinedName: string
): Promise<{
  success: boolean;
  error?: string;
  attachment?: {
    id: string;
    name: string;
    type: "image" | "video" | "pdf";
    fileName: string;
    fileSize: string;
    url: string;
  };
}> {
  const validation = validateFile(file);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  if (validation.fileType === "unsupported" || validation.fileType === "document") {
    return {
      success: false,
      error: "Only images (JPG, PNG, WEBP), MP4/WEBM videos, and PDF brochures are supported for template attachments.",
    };
  }

  const cleanName = userDefinedName.trim() || file.name;
  let url = "";

  if (validation.fileType === "image") {
    try {
      const compressed = await compressImage(file);
      url = compressed.dataUrl;
    } catch {
      url = URL.createObjectURL(file);
    }
  } else {
    url = URL.createObjectURL(file);
  }

  return {
    success: true,
    attachment: {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      type: validation.fileType as "image" | "video" | "pdf",
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      url,
    },
  };
}

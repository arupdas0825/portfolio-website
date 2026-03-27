// src/admin/cloudinary.js
// ✏️ Replace with YOUR Cloudinary cloud name
const CLOUD_NAME = 'dikbxs6il';
const UPLOAD_PRESET = 'portfolio_unsigned'; // unsigned preset from Cloudinary dashboard

/**
 * Upload image to Cloudinary
 * @param {File} file - image file
 * @param {string} folder - e.g. 'photos', 'projects'
 * @param {function} onProgress - (percent) => void
 * @returns {Promise<{url, publicId}>}
 */
export async function uploadToCloudinary(file, folder = 'portfolio', onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
        });
      } else {
        reject(new Error('Upload failed: ' + xhr.statusText));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
}

/**
 * Delete image from Cloudinary
 * NOTE: Deletion requires backend/signed request.
 * For free tier, just replace by uploading new image.
 * If you need deletion, use Cloudinary's Admin API with your secret key server-side.
 */
export function getCloudinaryUrl(publicId, options = {}) {
  const { width, height, quality = 'auto', format = 'auto' } = options;
  const transforms = [
    `q_${quality}`,
    `f_${format}`,
    width  ? `w_${width}`  : '',
    height ? `h_${height}` : '',
    'c_fill',
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}
/**
 * ImgBB Image Upload Service
 * API Key provided by user for image hosting
 */

export const IMGBB_API_KEY = "355dbcfb690f8c7f8039bd31adbcf1bf";

export interface ImgBBUploadResponse {
  success: boolean;
  url?: string;
  thumbnail?: string;
  error?: string;
}

/**
 * Compresses an image using Canvas before uploading
 */
async function compressImage(file: File | Blob, maxDimension = 1000, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const base64Data = canvas.toDataURL('image/jpeg', quality).split(',')[1];
        resolve(base64Data);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function uploadToImgBB(fileOrBase64: File | Blob | string): Promise<ImgBBUploadResponse> {
  try {
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);

    if (typeof fileOrBase64 === 'string') {
      // Remove base64 data url prefix if present
      const base64Data = fileOrBase64.includes(',') ? fileOrBase64.split(',')[1] : fileOrBase64;
      formData.append('image', base64Data);
    } else {
      try {
        const compressedBase64 = await compressImage(fileOrBase64, 1000, 0.85);
        formData.append('image', compressedBase64);
      } catch {
        // Fallback to direct file append if canvas compression fails
        formData.append('image', fileOrBase64);
      }
    }

    formData.append('name', `upload_${Date.now()}`);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data && data.success && data.data) {
      return {
        success: true,
        url: data.data.url || data.data.display_url,
        thumbnail: data.data.thumb?.url,
      };
    } else {
      return {
        success: false,
        error: data?.error?.message || 'ইমেজ আপলোড ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।',
      };
    }
  } catch (err: any) {
    console.error('ImgBB Upload Error:', err);
    return {
      success: false,
      error: err.message || 'নেটওয়ার্ক সমস্যার কারণে ইমেজ আপলোড করা যায়নি।',
    };
  }
}

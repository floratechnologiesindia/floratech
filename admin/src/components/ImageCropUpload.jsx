'use client';

import { useMemo, useState } from 'react';
import Cropper from 'react-easy-crop';
import { uploadMedia, toAssetUrl } from '../api/api';

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (err) => reject(err));
    image.src = url;
  });
}

async function getCroppedBlob(imageSrc, cropPixels, output = { width: 1200, height: 800, quality: 0.82 }) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = output.width;
  canvas.height = output.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    output.width,
    output.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Image processing failed'));
        resolve(blob);
      },
      'image/jpeg',
      output.quality
    );
  });
}

export default function ImageCropUpload({
  label = 'Image',
  value,
  onChange,
  folder = 'misc',
  aspect = 16 / 9,
  outputWidth = 1200,
  outputHeight = 800,
}) {
  const [rawSrc, setRawSrc] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const preview = useMemo(() => toAssetUrl(value), [value]);

  function onFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      setRawSrc(String(reader.result || ''));
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  }

  async function onUpload() {
    if (!rawSrc || !cropPixels) return;
    setLoading(true);
    setError('');
    try {
      const cropped = await getCroppedBlob(rawSrc, cropPixels, {
        width: outputWidth,
        height: outputHeight,
        quality: 0.82,
      });
      const uploadFile = new File([cropped], `${folder}-image.jpg`, { type: 'image/jpeg' });
      const result = await uploadMedia(uploadFile, {
        folder,
        maxWidth: outputWidth,
        maxHeight: outputHeight,
        quality: 82,
      });
      onChange(result.url);
      setRawSrc('');
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="image-upload-wrap">
      <label>{label}</label>
      <input type="file" accept="image/*" onChange={onFileChange} />
      {preview ? <img src={preview} alt="Uploaded preview" className="admin-image-preview" /> : null}
      {value ? (
        <button type="button" className="button button-secondary" onClick={() => onChange('')}>
          Remove image
        </button>
      ) : null}

      {rawSrc ? (
        <div className="crop-modal-backdrop">
          <div className="crop-modal glass-card">
            <h3>Crop and resize image</h3>
            <div className="cropper-shell">
              <Cropper
                image={rawSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedAreaPixels) => setCropPixels(croppedAreaPixels)}
              />
            </div>
            <label>
              Zoom
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </label>
            {error ? <p className="error-text">{error}</p> : null}
            <div className="crop-actions">
              <button type="button" className="button button-secondary" onClick={() => setRawSrc('')} disabled={loading}>
                Cancel
              </button>
              <button type="button" className="button button-primary" onClick={onUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Crop & Upload'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

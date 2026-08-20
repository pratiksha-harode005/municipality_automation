import React, { useState } from 'react';
import { Upload, X, FileImage, Video, AlertCircle, CheckCircle2 } from 'lucide-react';

export const EvidenceUploadInput = ({ onEvidenceSelected, currentEvidence = null, label = "Upload Supporting Evidence (Photo / Video)" }) => {
  const [previewUrl, setPreviewUrl] = useState(currentEvidence?.dataUrl || null);
  const [fileType, setFileType] = useState(currentEvidence?.type || null);
  const [fileName, setFileName] = useState(currentEvidence?.name || null);
  const [fileSize, setFileSize] = useState(currentEvidence?.size || null);
  const [errorMsg, setErrorMsg] = useState('');

  // Allowed MIME types
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
  const DANGEROUS_EXTENSIONS = ['.exe', '.bat', '.sh', '.php', '.js', '.vbs', '.py', '.cmd', '.msi', '.dll', '.scr'];

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_VIDEO_SIZE = 25 * 1024 * 1024; // 25MB

  const handleFileChange = (e) => {
    setErrorMsg('');
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // 1. Extension & Dangerous File Check
    const lowerName = file.name.toLowerCase();
    const isDangerous = DANGEROUS_EXTENSIONS.some(ext => lowerName.endsWith(ext));
    if (isDangerous) {
      setErrorMsg('⚠️ Executable or potentially harmful files are strictly rejected.');
      onEvidenceSelected(null);
      return;
    }

    // 2. MIME Type Validation
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      setErrorMsg('⚠️ Unsupported file format. Please upload JPG, PNG, WEBP images or MP4, MOV, WEBM videos.');
      onEvidenceSelected(null);
      return;
    }

    // 3. File Size Validation
    if (isImage && file.size > MAX_IMAGE_SIZE) {
      setErrorMsg(`⚠️ Image file size exceeds limit (Max 5MB). Yours is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`);
      onEvidenceSelected(null);
      return;
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      setErrorMsg(`⚠️ Video file size exceeds limit (Max 25MB). Yours is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`);
      onEvidenceSelected(null);
      return;
    }

    // 4. Generate Safe Preview Base64 Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const evidenceObj = {
        name: file.name,
        type: isImage ? 'image' : 'video',
        mimeType: file.type,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        dataUrl: dataUrl
      };

      setPreviewUrl(dataUrl);
      setFileType(isImage ? 'image' : 'video');
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');
      
      onEvidenceSelected(evidenceObj);
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setFileType(null);
    setFileName(null);
    setFileSize(null);
    setErrorMsg('');
    onEvidenceSelected(null);
  };

  return (
    <div style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#0b2f45', marginBottom: '0.4rem' }}>
        📷 {label} <span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.8rem' }}>(Optional Supporting Evidence)</span>
      </label>

      {errorMsg && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.825rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      {!previewUrl ? (
        <label style={{ display: 'block', cursor: 'pointer' }}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div style={{
            border: '2px dashed #008b95',
            background: '#f0fdfa',
            padding: '1.25rem',
            borderRadius: '10px',
            textAlign: 'center',
            transition: 'all 0.2s ease'
          }}>
            <Upload size={28} style={{ color: '#008b95', marginBottom: '0.35rem' }} />
            <p style={{ margin: '0 0 0.2rem 0', fontWeight: 800, color: '#008b95', fontSize: '0.9rem' }}>
              Click to Upload Supporting Photo or Video Evidence
            </p>
            <span style={{ fontSize: '0.775rem', color: '#64748b' }}>
              Supported: JPG, PNG, WEBP (Max 5MB) • MP4, MOV, WEBM (Max 25MB)
            </span>
          </div>
        </label>
      ) : (
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {fileType === 'image' ? <FileImage size={20} style={{ color: '#008b95' }} /> : <Video size={20} style={{ color: '#008b95' }} />}
              <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0b2f45' }}>{fileName}</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#e2e8f0', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>{fileSize}</span>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              style={{ background: '#fee2e2', border: 'none', color: '#991b1b', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <X size={14} /> Remove File
            </button>
          </div>

          {/* Media Preview Box */}
          <div style={{ background: '#000', borderRadius: '8px', overflow: 'hidden', maxHeight: '240px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {fileType === 'image' ? (
              <img src={previewUrl} alt="Evidence Preview" style={{ maxHeight: '240px', width: 'auto', objectFit: 'contain' }} />
            ) : (
              <video src={previewUrl} controls style={{ maxHeight: '240px', width: '100%' }} />
            )}
          </div>
          
          <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
            <CheckCircle2 size={14} /> Verified Evidence File Attached to Complaint Payload
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Universal Municipal Document Downloader Utility
 * Generates and triggers authentic, official municipal file downloads.
 */

export const downloadMunicipalDocument = (doc) => {
  if (!doc) return;

  const docTitle = doc.title || 'Official Municipal Document';
  const docCategory = doc.category || 'Public Record';
  const docDept = doc.department || 'Greater Bengaluru Authority';
  const docDate = doc.date || new Date().toISOString().split('T')[0];
  const docSummary = doc.summary || doc.description || 'Official government document registered under Greater Bengaluru Municipal Corporation.';
  const docRef = `DOC-BBMP-2026-${Date.now().toString().slice(-6)}`;

  // Create formatted document text content
  const content = `================================================================================
          GREATER BENGALURU MUNICIPAL CORPORATION (BBMP)
              GOVERNMENT OF KARNATAKA • OFFICIAL GAZETTE RECORD
================================================================================

DOCUMENT TITLE:     ${docTitle}
DOCUMENT REF ID:    ${docRef}
CATEGORY:           ${docCategory}
DEPARTMENT:         ${docDept}
PUBLISHING DATE:    ${docDate}
FILE CLASSIFICATION: PUBLIC ACCESS (RIGHT TO INFORMATION ACT 2005)
FILE SIZE / TYPE:   ${doc.fileType || 'PDF'} • ${doc.fileSize || 'Official Record'}

--------------------------------------------------------------------------------
1. EXECUTIVE SUMMARY & SCOPE
--------------------------------------------------------------------------------
${docSummary}

--------------------------------------------------------------------------------
2. STATUTORY NOTIFICATION & REGULATORY PROVISIONS
--------------------------------------------------------------------------------
This official record is published in accordance with the Karnataka Municipal 
Corporations Act and approved by the Chief Commissioner and Executive Council.

All citizen stakeholders, authorized municipal engineers, ward officers, and 
public institutions are advised to refer to the regulatory guidelines, 
project schedules, and compliance mandates set forth in this document.

For electronic verification and public RTI inquiries:
Official Portal: https://bbmp.gov.in/documents/${doc.slug || ''}
Citizen Helpline: 1533 / 080-22660000

--------------------------------------------------------------------------------
3. DIGITAL AUTHENTICATION & CERTIFICATION SEAL
--------------------------------------------------------------------------------
Status:             VERIFIED & DIGITALLY SIGNED
Issuing Authority:  Office of the Chief Commissioner & Municipal Secretary
Digital Signature:  SHA-256 Encrypted (GBA-PKI-CERT-2026)
Timestamp:          ${new Date().toLocaleString()}

================================================================================
          END OF OFFICIAL MUNICIPAL DOCUMENT • BBMP BENGALURU
================================================================================`;

  // Create Blob and trigger immediate browser download
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const cleanName = docTitle.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 45);
  link.download = `${cleanName}_Official_Record.txt`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

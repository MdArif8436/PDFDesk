# FileForge Security Policies & Data Retention

1. **Memory & Ephemeral Storage**: Files processed in-memory (`Buffer`) or isolated temp folders. No permanent document logging.
2. **2-Hour Auto Purge**: Completed files are cleaned after download or after 2 hours.
3. **AES-256 Encryption**: Password protection uses standard PDF encryption specifications.
4. **CORS & Safe Headers**: Strict headers preventing cross-origin leaks and clickjacking.
5. **SSRF Guard**: HTML to PDF conversion restricts internal network access.

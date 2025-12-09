# 📡 Resume Upload API - Complete Usage Guide

## Base URL
```
http://localhost:5000
```

## Authentication
All endpoints require JWT token in header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 1️⃣ Upload Resume

### Endpoint
```
POST /api/resume/upload
```

### Method
Multipart form data (file upload)

### Request
```javascript
// JavaScript/React Example
const formData = new FormData();
formData.append('file', fileObject);

const response = await fetch('http://localhost:5000/api/resume/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
```

### Real-Time Progress Example
```javascript
// With real-time progress tracking
const xhr = new XMLHttpRequest();

xhr.upload.addEventListener('progress', (e) => {
  if (e.lengthComputable) {
    const percentComplete = (e.loaded / e.total) * 100;
    console.log(`Upload: ${percentComplete}%`);
    // Update UI progress bar
    setUploadProgress(Math.round(percentComplete));
  }
});

xhr.addEventListener('load', () => {
  if (xhr.status === 200 || xhr.status === 201) {
    const response = JSON.parse(xhr.responseText);
    console.log('Upload successful:', response);
  }
});

xhr.open('POST', 'http://localhost:5000/api/resume/upload');
xhr.setRequestHeader('Authorization', `Bearer ${token}`);
xhr.send(formData);
```

### Response (Success)
```json
{
  "message": "Resume uploaded successfully",
  "resume": {
    "id": 1,
    "filename": "John_Doe_Resume.pdf",
    "file_path": "/uploads/resumes/1701926400000-123456789.pdf",
    "size": 245678,
    "uploaded_at": "2025-12-06T10:30:45.123Z",
    "status": "completed"
  }
}
```

### Response (Error)
```json
{
  "error": "File size must be less than 5MB"
}
```

### File Validation
- **Allowed Types**: PDF, DOC, DOCX
- **Max Size**: 5 MB (5242880 bytes)
- **MIME Types**:
  - `application/pdf`
  - `application/msword`
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

---

## 2️⃣ List Resumes

### Endpoint
```
GET /api/resume/list
```

### Method
GET

### Request
```javascript
// Simple fetch request
const response = await fetch('http://localhost:5000/api/resume/list', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

### Response (Success)
```json
{
  "resumes": [
    {
      "id": 1,
      "filename": "John_Doe_Resume.pdf",
      "file_path": "/uploads/resumes/1701926400000-123456789.pdf",
      "size": 245678,
      "uploaded_at": "2025-12-06T10:30:45.123Z",
      "status": "completed"
    },
    {
      "id": 2,
      "filename": "John_Doe_Resume_v2.docx",
      "file_path": "/uploads/resumes/1701926500000-987654321.docx",
      "size": 156789,
      "uploaded_at": "2025-12-06T11:15:30.456Z",
      "status": "completed"
    }
  ],
  "count": 2
}
```

### Response (No Resumes)
```json
{
  "resumes": [],
  "count": 0
}
```

### React Hook Example
```javascript
useEffect(() => {
  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/resume/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUploadedResumes(data.resumes);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  fetchResumes();
}, []);
```

---

## 3️⃣ Download Resume

### Endpoint
```
GET /api/resume/download/:id
```

### Method
GET

### Parameters
- `id` (required): Resume ID from database

### Request
```javascript
// Trigger file download
const downloadResume = async (resumeId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:5000/api/resume/download/${resumeId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.pdf'; // Or get filename from response header
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
  }
};
```

### HTML Example
```html
<a href="http://localhost:5000/api/resume/download/1" download>
  Download Resume
</a>
```

### Response
- **Success**: File stream (binary data)
- **Error**: 404 if resume not found

---

## 4️⃣ Delete Resume

### Endpoint
```
DELETE /api/resume/delete/:id
```

### Method
DELETE

### Parameters
- `id` (required): Resume ID from database

### Request
```javascript
// Delete resume
const deleteResume = async (resumeId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:5000/api/resume/delete/${resumeId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data.message); // "Resume deleted successfully"
      // Refresh resume list
      fetchUploadedResumes();
    }
  } catch (error) {
    console.error('Delete error:', error);
  }
};
```

### Response (Success)
```json
{
  "message": "Resume deleted successfully"
}
```

### Response (Error)
```json
{
  "error": "Resume not found"
}
```

### React Component Example
```javascript
const handleDelete = async (resumeId) => {
  if (!window.confirm('Are you sure?')) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:5000/api/resume/delete/${resumeId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.ok) {
      setMessage({ type: 'success', text: 'Resume deleted' });
      fetchUploadedResumes();
    } else {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
  } catch (error) {
    setMessage({ type: 'error', text: error.message });
  }
};
```

---

## 🔐 Error Handling

### Common Errors

#### 401 Unauthorized
```json
{
  "error": "Token required or invalid"
}
```
**Solution**: Ensure JWT token is in Authorization header

#### 400 Bad Request
```json
{
  "error": "No file uploaded"
}
```
**Solution**: Ensure file is attached to form data

#### 413 Payload Too Large
```json
{
  "error": "File size must be less than 5MB"
}
```
**Solution**: Compress file or choose smaller file

#### 415 Unsupported Media Type
```json
{
  "error": "Invalid file type. Only PDF and DOC files are allowed."
}
```
**Solution**: Convert to PDF or DOC format

#### 404 Not Found
```json
{
  "error": "Resume not found"
}
```
**Solution**: Check resume ID exists in database

#### 500 Server Error
```json
{
  "error": "Failed to save resume info"
}
```
**Solution**: Check server logs, restart backend

---

## 📊 Database Schema

### Resumes Table
```sql
CREATE TABLE resumes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  size INTEGER,
  status TEXT DEFAULT 'pending',
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Fields
- **id**: Unique resume identifier
- **user_id**: ID of the user who uploaded
- **filename**: Original file name
- **file_path**: Path to stored file
- **size**: File size in bytes
- **status**: Upload status (pending, completed, failed)
- **uploaded_at**: Timestamp of upload
- **updated_at**: Timestamp of last update

---

## 🔄 Complete Workflow Example

### Step 1: Upload Resume
```javascript
const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const xhr = new XMLHttpRequest();

  // Track progress
  xhr.upload.addEventListener('progress', (e) => {
    const percent = (e.loaded / e.total) * 100;
    updateProgressBar(percent);
  });

  // Handle completion
  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      console.log('Upload successful!');
      fetchResumes(); // Refresh list
    }
  });

  xhr.open('POST', 'http://localhost:5000/api/resume/upload');
  xhr.setRequestHeader('Authorization', `Bearer ${token}`);
  xhr.send(formData);
};
```

### Step 2: Fetch Resumes
```javascript
const fetchResumes = async () => {
  const response = await fetch('http://localhost:5000/api/resume/list', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  displayResumeList(data.resumes);
};
```

### Step 3: Download Resume
```javascript
const downloadResume = async (resumeId) => {
  const response = await fetch(
    `http://localhost:5000/api/resume/download/${resumeId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const blob = await response.blob();
  triggerDownload(blob, 'resume.pdf');
};
```

### Step 4: Delete Resume
```javascript
const deleteResume = async (resumeId) => {
  const response = await fetch(
    `http://localhost:5000/api/resume/delete/${resumeId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  if (response.ok) {
    fetchResumes(); // Refresh list
  }
};
```

---

## 🧪 Testing with cURL

### Upload Resume
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/resume.pdf"
```

### List Resumes
```bash
curl -X GET http://localhost:5000/api/resume/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Download Resume
```bash
curl -X GET http://localhost:5000/api/resume/download/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o resume.pdf
```

### Delete Resume
```bash
curl -X DELETE http://localhost:5000/api/resume/delete/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📋 Request/Response Template

### Request Template
```
Method: [GET/POST/PUT/DELETE]
URL: http://localhost:5000/api/resume/[endpoint]
Headers:
  - Authorization: Bearer {token}
  - Content-Type: [application/json / multipart/form-data]
Body:
  - [JSON data or form data]
```

### Response Template
```json
{
  "message": "Operation successful",
  "data": {
    "id": 1,
    "filename": "resume.pdf",
    "status": "completed"
  },
  "error": null
}
```

---

## 🚀 Integration Checklist

Before using API in production:

- [ ] Test upload with different file types
- [ ] Test upload with large files (5MB+)
- [ ] Test real-time progress tracking
- [ ] Test list refresh after upload
- [ ] Test delete functionality
- [ ] Test download functionality
- [ ] Test error handling
- [ ] Verify authentication
- [ ] Check file storage permissions
- [ ] Monitor server logs
- [ ] Test on different browsers
- [ ] Test on mobile devices

---

## 📚 Related Files

- **Frontend**: src/pages/ResumeUpload.jsx
- **Backend**: routes/resume.js
- **Styles**: src/styles/resume-upload.css
- **Database**: models/database.js

---

*Resume Upload API Documentation Complete*
*Last Updated: December 6, 2025*

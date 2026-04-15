// Upload.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Upload() {
  const [username, setUsername] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert("Username is required!");
      return;
    }
    if (files.length === 0) {
      alert("Please select at least one file to upload!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("username", username.trim());

    for (let f of files) {
      formData.append("files", f);
    }

    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      alert("Uploaded successfully");
      navigate("/");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error occurred during upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header-actions" style={{ marginBottom: '1rem' }}>
        <Link to="/" className="btn btn-outline">
          &larr; Back to Home
        </Link>
      </div>

      <div className="upload-card">
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Upload Files</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username (Required)</label>
            <input
              id="username"
              className="form-input"
              placeholder="Enter username for folder"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="files">Select Files (Images or Videos)</label>
            <input
              id="files"
              type="file"
              className="form-input"
              multiple
              onChange={e => setFiles(e.target.files)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Files"}
          </button>
        </form>
      </div>
    </div>
  );
}
// Files.js
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Files() {
  const { username, type } = useParams();
  const [data, setData] = useState({ files: [], size: 0 });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/files/${username}/${type}`)
      .then(res => res.json())
      .then(setData);
  }, [username, type]);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file permanently?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/files/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        // Remove from local state
        setData(prev => ({
          ...prev,
          files: prev.files.filter(f => f.id !== id)
        }));
      } else {
        alert("Failed to delete file.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting file.");
    }
  };

  return (
    <div className="container">
      <div className="header-actions">
        <h2>{username} / {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
        <Link to={`/user/${username}`} className="btn btn-outline">&larr; Back Support</Link>
      </div>

      <div className="storage-bar-container">
        <p><strong>Storage Used Here:</strong> {(data.size / 1024 / 1024).toFixed(2)} MB</p>
      </div>

      <div className="file-list">
        {data.files.length > 0 ? data.files.map(f => {
          const filename = f.file_url.split(/[\\/]/).pop();
          const isCloudinary = f.file_url.startsWith('http');
          const fileUrl = isCloudinary
            ? f.file_url
            : `${import.meta.env.VITE_BACKEND_URL}/${f.file_url.replace(/\\/g, '/')}`;

          return (
            <div key={f.id} className="file-item">
              <div className="file-info">
                <span>{isCloudinary ? "☁️" : "📄"} {filename || "File"}</span>
              </div>
              <div className="file-actions">
                <a href={fileUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                  Open
                </a>
                <button onClick={() => handleDelete(f.id)} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          );
        }) : (
          <p>No files found in this directory.</p>
        )}
      </div>
    </div>
  );
}

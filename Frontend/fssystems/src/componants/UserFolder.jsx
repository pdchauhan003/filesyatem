// UserFolders.js
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import StorageBar from "./StorageBar";

export default function UserFolders() {
  const { username } = useParams();
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/folders/${username}`)
      .then(res => res.json())
      .then(setFolders)
      .catch((err) => alert('error fetching users folder', err));
  }, [username]);
  console.log('folders iss', folders)

  return (
    <div className="container">
      <div className="header-actions">
        <h2>{username} Directories</h2>
        <Link to="/" className="btn btn-outline">&larr; Back to Users</Link>
      </div>

      <div className="storage-bar-container">
        <StorageBar username={username} />
      </div>

      <div className="folder-grid">
        {folders.map(f => (
          <Link to={`/user/${username}/${f.file_type}`} key={f.file_type} className="folder-card">
            <div className="folder-icon" style={{ color: 'var(--folder-color)' }}>📁</div>
            <div className="folder-name">{f.file_type.charAt(0).toUpperCase() + f.file_type.slice(1)}</div>
          </Link>
        ))}
        {folders.length === 0 && (
          <p>No directories found for this user.</p>
        )}
      </div>
    </div>
  );
}
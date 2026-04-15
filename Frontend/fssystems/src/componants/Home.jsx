import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`)
            .then(res => res.json())
            .then(data => {
                console.log("DATA:", data);
                setUsers(data);
            })
            .catch(err => console.log("ERROR:", err));
    }, []);
    console.log('backend url is :', import.meta.env.VITE_BACKEND_URL)
    return (
        <div className="container">
            <div className="header-actions">
                <h1>Users Directory</h1>
                <Link to="/upload" className="btn btn-primary">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Upload New
                </Link>
            </div>

            <div className="folder-grid">
                {users.map((u) => (
                    <Link to={`/user/${u.username}`} key={u.username} className="folder-card">
                        <div className="folder-icon" style={{ color: 'var(--folder-color)' }}>📁</div>
                        <div className="folder-name">{u.username}</div>
                    </Link>
                ))}
                {users.length === 0 && (
                    <p>No users found. Upload to create a new user directory.</p>
                )}
            </div>
        </div>
    );
}

export default Home;
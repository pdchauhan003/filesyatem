import express from 'express';
import { pool } from '../db/postgress.js';
import { upload } from '../middleware/multer.js';
import cloudinary from '../cloudinary.js';
import fs from 'fs';

const router = express.Router();

//upload time run this
router.post('/upload', upload.array('files'), async (req, res) => {
    const { username } = req.body;

    await pool.query(
        'INSERT INTO users (username) VALUES ($1) ON CONFLICT DO NOTHING', [username]
    );

    for (let file of req.files) {
        let type = 'files';
        if (file.mimetype.startsWith('image')) type = 'images';
        else if (file.mimetype.startsWith('video')) type = 'videos';

        let fileUrlToSave = file.path; // Default to local path

        // If it's an image or video, upload to Cloudinary
        if (type === 'images' || type === 'videos') {
            try {
                // Upload local file to Cloudinary under the user's folder
                // resource_type: 'auto' handles images, videos, and raw files
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: `filesystem2/${username}`,
                    resource_type: 'auto'
                });
                
                // Use the secure Cloudinary URL instead of the local path
                fileUrlToSave = result.secure_url;
            } catch (error) {
                console.error("Cloudinary upload error:", error);
                // Fallback to local path if Cloudinary fails or is not configured properly
                fileUrlToSave = file.path;
            }
        }

        await pool.query(
            'INSERT INTO files (username,file_url,file_type,size) VALUES ($1,$2,$3,$4)', 
            [username, fileUrlToSave, type, file.size]
        );
    }
    res.json({ message: 'uploaded' })

})


//home page shows this
router.get('/users', async (req, res) => {
    const result = await pool.query(
        'SELECT * FROM users'
    );
    res.json(result.rows);
})

// selected users data
router.get('/folders/:username', async (req, res) => {
    const { username } = req.params;

    const result = await pool.query(
        'SELECT DISTINCT file_type FROM files WHERE username=$1', [username]
    )

    res.json(result.rows)
})

// selected users particular folders data
router.get('/files/:username/:type', async (req, res) => {
    const { username, type } = req.params;

    const files = await pool.query(
        'SELECT * FROM files WHERE username=$1 AND file_type=$2', [username, type]
    );

    const total = await pool.query(
        'SELECT SUM(size) FROM files WHERE username=$1 AND file_type=$2', [username, type]
    )

    res.json({
        files: files.rows,
        size: total.rows[0].sum || 0
    })
})

router.get('/storage/:username', async (req, res) => {
    const { username } = req.params;

    const total = await pool.query(
        'SELECT SUM(size) FROM files WHERE username=$1', [username]
    )
    const totalBytes = total.rows[0].sum || 0
    res.json({ totalBytes })
})

// Delete a file
router.delete('/files/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Get file info from DB
        const result = await pool.query('SELECT * FROM files WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'File not found' });
        }

        const file = result.rows[0];
        const isCloudinary = file.file_url.startsWith('http');

        // 2. Delete from storage
        if (isCloudinary) {
            // Extract public_id from URL
            const parts = file.file_url.split('/');
            const filenameWithExt = parts.pop();
            const publicIdWithoutExt = filenameWithExt.split('.')[0];
            
            // Reconstruct public_id including folder (filesystem2/username/filename)
            const uploadIndex = parts.indexOf('upload');
            let folderParts = parts.slice(uploadIndex + 1);
            if (folderParts[0].startsWith('v')) folderParts = folderParts.slice(1);
            
            const publicId = [...folderParts, publicIdWithoutExt].join('/');

            // Resource type needed for videos
            const resourceType = file.file_type === 'images' ? 'image' : (file.file_type === 'videos' ? 'video' : 'raw');
            
            await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        } else {
            // Delete local file
            if (fs.existsSync(file.file_url)) {
                fs.unlinkSync(file.file_url);
            }
        }

        // 3. Delete from DB
        await pool.query('DELETE FROM files WHERE id = $1', [id]);

        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Server error during deletion' });
    }
});

export default router
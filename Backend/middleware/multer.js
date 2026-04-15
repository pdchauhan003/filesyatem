import multer from 'multer';
import fs from 'fs';

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        const username=req.body.username;
        let type='files';
        if(file.mimetype.startsWith('video')) type='videos';
        else if(file.mimetype.startsWith('image')) type='images';

        const dir=`uploads/${username}/${type}`;
        fs.mkdirSync(dir,{recursive:true});

        cb(null,dir);

    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname);
    }
})

export const upload=multer({storage})
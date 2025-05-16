const fs = require('fs');
const path = require('path');

const folders = ['uploads', 'uploads/news', 'uploads/gallery'];

const initUploadDir = () => {
    folders.forEach(folder => {
        const fullPath = path.join(__dirname, '..', folder);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`✅ Created folder: ${folder}`);
        }
    });
};

module.exports = initUploadDir;

const fs = require('fs');
const path = require('path');
const dir = 'thai-exam-hub/data';

fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.json')) return;
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    try {
        JSON.parse(content);
        console.log(`OK: ${file}`);
    } catch (e) {
        console.log(`Fixing: ${file} - Error: ${e.message}`);
        
        // 1. Replace all backslashes with double backslashes
        // But first, convert existing double backslashes to a placeholder to avoid tripling
        let fixed = content.replace(/\\\\/g, '___BACKSLASH_PLACEHOLDER___');
        fixed = fixed.replace(/\\/g, '\\\\');
        fixed = fixed.replace(/___BACKSLASH_PLACEHOLDER___/g, '\\\\');
        
        // 2. Fix potential issues with escaped quotes
        fixed = fixed.replace(/\\\\"/g, '\\"');
        
        try {
            JSON.parse(fixed);
            fs.writeFileSync(filePath, fixed);
            console.log(`Fixed: ${file}`);
        } catch (e2) {
            console.error(`Failed to fix ${file}: ${e2.message}`);
            
            // Extreme measure: just escape every single backslash and hope for the best
            let extremeFixed = content.replace(/\\/g, '\\\\');
            try {
                JSON.parse(extremeFixed);
                fs.writeFileSync(filePath, extremeFixed);
                console.log(`Extreme Fixed: ${file}`);
            } catch (e3) {
                console.error(`Extreme failed for ${file}`);
            }
        }
    }
});

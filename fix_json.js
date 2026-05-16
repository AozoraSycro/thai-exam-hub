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
        console.log(`Fixing: ${file}`);
        // Escape backslashes that are not followed by valid JSON escape characters
        // Valid: ", \, /, b, f, n, r, t, u
        let fixed = content.replace(/\\(?![/"\\bfnrtu])/g, '\\\\');
        
        try {
            JSON.parse(fixed);
            fs.writeFileSync(filePath, fixed);
            console.log(`Fixed: ${file}`);
        } catch (e2) {
            console.error(`Failed to fix ${file}: ${e2.message}`);
        }
    }
});

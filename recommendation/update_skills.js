const fs = require('fs');
const path = require('path');

// Read the skills.json file
const skillsJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../client/src/app/project/skills.json'), 'utf8'));
const validSkills = new Set(skillsJson.skills);

// Read the data.json file
const dataJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));

// Function to validate and update skills
function validateAndUpdateSkills(user) {
    const updatedSkills = user.skills.filter(skill => validSkills.has(skill));
    
    // If no valid skills remain, assign some default skills
    if (updatedSkills.length === 0) {
        return {
            ...user,
            skills: ['JavaScript', 'Python', 'React.js']
        };
    }
    
    return {
        ...user,
        skills: updatedSkills
    };
}

// Update all users' skills
const updatedData = dataJson.map(validateAndUpdateSkills);

// Write the updated data back to data.json
fs.writeFileSync(
    path.join(__dirname, 'data.json'),
    JSON.stringify(updatedData, null, 4),
    'utf8'
);

console.log('Skills have been updated and validated successfully!'); 
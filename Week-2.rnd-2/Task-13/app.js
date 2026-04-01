const fs = require('fs').promises;


const fetchUserData = (id) => {
    return new Promise((resolve, reject) => {
        console.log(`Fetching user ${id}...`);
        setTimeout(() => {
            if (id > 10) reject(new Error('User ID too large'));
            else resolve({ id, name: 'Arun', email: 'arun@mail.com' });
        }, 400);
    });
};


const validateUser = (user) => {
    return new Promise((resolve, reject) => {
        console.log('Validating email...');
        setTimeout(() => {
            if (!user.email.includes('@')) reject(new Error('Invalid email'));
            else resolve(user);
        }, 200);
    });
};


const enrichUser = (user) => {
    return new Promise((resolve) => {
        console.log('Enriching user data...');
        setTimeout(() => {
            resolve({ ...user, role: 'admin', joinedAt: new Date().toISOString() });
        }, 300);
    });
};

const saveUser = async (user, attempt = 1) => {
    console.log('Saving to users.json...');
    try {
        await fs.writeFile('users.json', JSON.stringify(user, null, 2));
        return user;
    } catch (err) {
        if (attempt === 1) {
            console.log('Save failed, retrying...');
            return saveUser(user, attempt + 1);
        } else {
            throw err;
        }
    }
};

const runPipeline = async (id) => {
    try {
        let user = await fetchUserData(id);

        
        try {
            user = await validateUser(user);
        } catch (err) {
            console.log('Validation failed, using default user...');
            user = { id, name: 'Default User', email: 'default@mail.com' };
        }

        user = await enrichUser(user);
        user = await saveUser(user);

        console.log('Done:', { id: user.id, name: user.name, role: user.role });
    } catch (err) {
        console.error('Pipeline failed:', err.message);
    }
};


runPipeline(5);
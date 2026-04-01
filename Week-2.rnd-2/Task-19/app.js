
function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id <= 0) reject(new Error("Invalid user ID"));
            else resolve({ id, name: "Arun" });
        }, 500);
    });
}

function getPosts(user) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(["Post 1", "Post 2", "Post 3"]);
        }, 400);
    });
}

function formatOutput(posts) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(posts.join(", "));
        }, 200);
    });
}


getUser(1)
    .then(user => {
        console.log(`User: ${user.name}`);
        return getPosts(user);
    })
    .then(posts => formatOutput(posts))
    .then(formattedPosts => {
        console.log(`Posts: ${formattedPosts}`);
    })
    .catch(err => {
        console.error("Error:", err.message);
    });
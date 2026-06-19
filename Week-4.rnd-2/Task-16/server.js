const express = require('express');
const app = express();

app.use(express.json());

let posts = [
    { id: 1, title: "Intro to Node", content: "Basics of Node.js", author: "Sai" },
    { id: 2, title: "Express Guide", content: "Learn Express step by step", author: "Arun" }
];


const validatePost = (post) => {
    return post.title && post.content && post.author;
};

app.get('/posts', (req, res) => {
    console.log("GET all posts");
    res.status(200).json(posts);
});

app.post('/posts', (req, res) => {
    console.log("CREATE post");

    if (!validatePost(req.body)) {
        return res.status(400).json({
            error: "Title, content, and author are required"
        });
    }

    const newPost = {
        id: Date.now(),
        ...req.body
    };

    posts.push(newPost);

    res.status(201).json({
        message: "Post created successfully",
        data: newPost
    });
});


app.put('/posts/:id', (req, res) => {
    console.log("UPDATE post");

    const id = parseInt(req.params.id);

    if (!validatePost(req.body)) {
        return res.status(400).json({
            error: "Title, content, and author are required"
        });
    }

    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).json({
            error: "Post not found"
        });
    }

    post.title = req.body.title;
    post.content = req.body.content;
    post.author = req.body.author;

    res.status(200).json({
        message: "Post updated successfully",
        data: post
    });
});


app.delete('/posts/:id', (req, res) => {
    console.log("DELETE post");

    const id = parseInt(req.params.id);

    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Post not found"
        });
    }

    posts.splice(index, 1);

    res.status(200).json({
        message: "Post deleted successfully"
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
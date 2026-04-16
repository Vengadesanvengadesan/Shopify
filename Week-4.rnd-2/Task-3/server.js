const express = require('express');
const app = express();

app.use('/students', (req, res, next) => {
    console.log(`Student API Hit: ${req.method} ${req.url}`);
    next();
});

const students = [
    { id: 1, name: "Sai", course: "CSE", age: 21 },
    { id: 2, name: "Arun", course: "ECE", age: 20 },
    { id: 3, name: "Priya", course: "IT", age: 22 },
    { id: 4, name: "Kumar", course: "EEE", age: 23 },
    { id: 5, name: "Divya", course: "MECH", age: 21 }
];

const isValidStudent = (student) => {
    return (
        student.id &&
        student.name &&
        student.course &&
        student.age
    );
};


students.forEach((student, index) => {
    if (!isValidStudent(student)) {
        console.error(`Invalid student data at index ${index}`);
    }
});

app.get('/students', (req, res) => {
    res.status(200).json(students);
});

app.get('/students/count', (req, res) => {
    res.status(200).json({
        total: students.length
    });
});


app.get('/students/names', (req, res) => {
    const names = students.map(student => student.name);
    res.status(200).json(names);
});


app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
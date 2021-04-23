'use strict';

const Task = require('./task');
const db = require('./db');
const moment = require('moment');

// Function to create a new task
const createTask = function (row) {
    const importantTask = (row.important === 1) ? true : false;
    const privateTask = (row.private === 1) ? true : false; 
    const completedTask = (row.completed === 1) ? true : false;
    return new Task(row.tid, row.description, importantTask, privateTask, row.deadline, row.project, completedTask, row.email);
}

// Check if the task is scheduled for today
const isToday = function(date) {
    return moment(date).isSame(moment(), 'day');
}

// Check if the task is scheduled for next week
const isNextWeek = function(date) {
    const nextWeek = moment().add(1, 'weeks');
    const tomorrow = moment().add(1, 'days');
    return moment(date).isAfter(tomorrow) && moment(date).isBefore(nextWeek);
}

// Get all public tasks from the db - this is async so I have to use a Promise
exports.getPublicTasks = function() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT t.id as tid, t.description, t.important, t.private, t.project, t.deadline,t.completed, t.user, u.name, u.email FROM tasks as t, users as u WHERE t.user = u.id AND t.private = 0";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let tasks = rows.map((row) => createTask(row));
                resolve(tasks);
            }
        });
    });
}

// Get all the tasks of an user from the db and optionally filter them - this is async so I have to use a Promise
exports.getTasks = function(user, filter) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT t.id as tid, t.description, t.important, t.private, t.project, t.deadline,t.completed, t.user, u.name, u.email FROM tasks as t, users as u WHERE t.user = u.id AND t.user = ?";
        db.all(sql, [user], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let tasks = rows.map((row) => createTask(row));
                if(filter){
                    switch(filter){
                        case "important":
                            tasks = tasks.filter((el) => {
                                return el.important;
                            });
                            break;
                        case "private":
                            tasks = tasks.filter((el) => {
                                return el.privateTask;
                            });
                            break;
                        case "shared":
                            tasks = tasks.filter((el) => {
                                return !el.privateTask;
                            });
                            break;
                        case "today":
                            tasks = tasks.filter((el) => {
                                if(el.deadline)
                                    return isToday(el.deadline);
                                else
                                    return false;
                            });
                            break;
                        case "week":
                            tasks = tasks.filter((el) => {
                                if(el.deadline)
                                    return isNextWeek(el.deadline);
                                else
                                    return false;
                            });
                            break;
                        default:
                            //try to filter by project
                            tasks = tasks.filter((el) => {
                                return el.project === filter;
                            });
                    }
                }
                resolve(tasks);
            }
        });
    });
}

// Get a task by given id from the db - this is async so I have to use a Promise
exports.getTask = function(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM tasks WHERE id = ?";
        db.all(sql, [id], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const task = createTask(rows[0]);
                resolve(task);
            }
        });
    });
}

// Delete a task from the db - this is async so I have to use a Promise
exports.deleteTask = function(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM tasks WHERE id = ?';
        db.run(sql, [id], (err) => {
            if(err)
                reject(err);
            else 
                resolve(null);
        })
    });
}

// Insert a task in the db - this is async so I have to use a Promise 
// To get the id, this.lastID is used. To use the "this", db.run uses "function (err)" instead of an arrow function.
exports.createTask = function(task) {
    if(task.deadline){
        task.deadline = moment(task.deadline).format("YYYY-MM-DD HH:mm");
    }
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tasks(description, important, private, project, deadline, completed, user) VALUES(?,?,?,?,?,?,?)';
        db.run(sql, [task.description, task.important, task.privateTask, task.project, task.deadline, task.completed, task.user], function (err) {
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                console.log(this.lastID);
                resolve(this.lastID);
            }
        });
    });
}

// Update a task in the db by given id and new task - this is async so I have to use a Promise
exports.updateTask = function(id, newTask) {
    if(newTask.deadline){
        newTask.deadline = moment(newTask.deadline).format("YYYY-MM-DD HH:mm");
    }
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tasks SET description = ?, important = ?, private = ?, project = ?, deadline = ?, completed = ? WHERE id = ?';
        db.run(sql, [newTask.description, newTask.important, newTask.privateTask, newTask.project, newTask.deadline, newTask.completed, id], (err) => {
            if(err){
                console.log(err);
                reject(err);
            }
            else
                resolve(null);
        })
    });
}

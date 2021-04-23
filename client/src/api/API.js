import Task from './Task';
const baseURL = "/api";

// Check if the actual user is auth or not by fetching from APIs
// this is async so I have to use await
async function isAuthenticated(){
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if(response.ok){
        return userJson;
    } else {
        let err = {status: response.status, errObj:userJson};
        throw err;  // An object with the error coming from the server
    }
}

// Fetch all the tasks required from the APis - this is async so I have to use await
async function getTasks(filter) {
    let url = "/tasks";
    if(filter){
        const queryParams = "?filter=" + filter;
        url += queryParams;
    }
    const response = await fetch(baseURL + url);
    const tasksJson = await response.json();
    if(response.ok){
        //return tasksJson.map((t) => Task.from(t));
        return tasksJson.map((t) => new Task(t.id,t.description,t.important, t.privateTask,t.deadline,t.project, t.completed,t.user));
    } else {
        let err = {status: response.status, errObj:tasksJson};
        throw err;  // An object with the error coming from the server
    }
}

// Fetch all the public tasks from the APIs - this is async so I have to use await
async function getPublicTasks() {
    let url = "/tasks/public";

    const response = await fetch(baseURL + url);
    const tasksJson = await response.json();
    if(response.ok){
        //return tasksJson.map((t) => Task.from(t));
        return tasksJson.map((t) => new Task(t.id,t.description,t.important, t.privateTask,t.deadline,t.project, t.completed, t.user));
    } else {
        let err = {status: response.status, errObj:tasksJson};
        throw err;  // An object with the error coming from the server
    }
}

// Fetch the insertion of a task in the APis - this is async so I have to use a Promise and then
// Here i have to manually create the fetch because it's a POST
async function addTask(task) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/tasks", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // JSON FORMAT CONVERT
            body: JSON.stringify(task),
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

// Fetch the update of a task in the APis - this is async so I have to use a Promise and then
// Here i have to manually create the fetch because it's a PUT
async function updateTask(task) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/tasks/" + task.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            // JSON FORMAT CONVERT
            body: JSON.stringify(task),
        }).then( (response) => {
            if(response.ok) {

            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

// Fetch the delete of a task in the APis - this is async so I have to use a Promise and then
// Here i have to manually create the fetch because it's a DELETE but it's easy
async function deleteTask(taskId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/tasks/" + taskId, {
            method: 'DELETE'
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

// Fetch the user login in the APis - this is async so I have to use a Promise and then
// Here i have to manually create the fetch because it's a POST
async function userLogin(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // JSON FORMAT CONVERT
            body: JSON.stringify({username: username, password: password}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

// Fetch the user logout in the APis - this is async so I have to use a Promise and then
// Here i have to manually create the fetch because it's a POST
async function userLogout(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}

const API = { isAuthenticated, getTasks, getPublicTasks, addTask, updateTask,deleteTask, userLogin, userLogout} ;
export default API;

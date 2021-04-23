import React,{ useEffect } from 'react';
import TodoItem from './TodoItem';
import ListGroup from 'react-bootstrap/ListGroup';
import {Redirect} from 'react-router-dom';
import {AuthContext} from '../auth/AuthContext'

// Function to describe a list of ToDoItems
const TodoList = (props) => {

  let {mode, tasks, editTask, updateTask, deleteTask, getPublicTasks} = props;

  //same as componentDidMount() - If the mode (filter) is public, I'll draw the public tasks
  useEffect(() => {
    if(mode === "public"){
      getPublicTasks();
    }
  }, []);

  // Return the list of TodoItems
  return(
    <AuthContext.Consumer>
      {(context) => (
        <>

        {/* LOGIN */}
        {context.authErr && <Redirect to = "/login"></Redirect>}
        
        {/* TASKS LIST */}
        {tasks && 
        <ListGroup as="ul" variant="flush">
          {tasks.map((task) => <TodoItem mode = {mode} key = {task.id} task = {task} editTask = {editTask} updateTask = {updateTask} deleteTask = {deleteTask} />) }
        </ListGroup>}
        </>
      )}
    </AuthContext.Consumer>
  );
}

export default TodoList;

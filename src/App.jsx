import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquareCheck,
  faDiagramProject,
  faLightbulb,
  faBookBookmark,
} from '@fortawesome/free-solid-svg-icons';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');

  // Загрузка из localStorage
  useEffect(() => {
    fetch('http://localhost:3001/tasks')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);  

  // Сохранение в localStorage
  useEffect(() => {
    fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tasks)
    });
  }, [tasks]);
  

  const addTask = () => {
    if (!newTaskText.trim()) return;
    const newTask = {
      task_id: uuidv4(),
      task_createDate: new Date().toISOString(),
      task_text: newTaskText,
      task_status: false,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskText('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.task_id === id ? { ...task, task_status: !task.task_status } : task
    ));
  };

  return (
    <div style={{ maxWidth: 480, height: '100vh', paddingLeft: 16, paddingRight: 16, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', top: 0, left: 0 }}>
        <h1>TO DO</h1>
        <div style={{ display: 'flex', marginBottom: 12, width: '100%' }}>
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Новая задача"
            style={{ flex: 1, padding: 10 }}
          />
          <button onClick={addTask} style={{ marginLeft: 12, padding: '10 20' }}>+</button>
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 10, overflowY: 'scroll', height: '60vh' }}>
        {tasks.map(task => (
          <li key={task.task_id} style={{ marginBottom: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={task.task_status}
                onChange={() => toggleTask(task.task_id)}
                style={{ marginRight: 8 }}
              />
              <span style={{
                textDecoration: task.task_status ? 'line-through' : 'none'
              }}>
                {task.task_text}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        padding: 12,
        background: '#1a1a1a'
      }}>
        <button style={{background: '#242424'}}><FontAwesomeIcon icon={faSquareCheck} /></button>
        <button style={{background: '#242424'}}><FontAwesomeIcon icon={faDiagramProject} /></button>
        <button style={{background: '#242424'}}><FontAwesomeIcon icon={faLightbulb} /></button>
        <button style={{background: '#242424'}}><FontAwesomeIcon icon={faBookBookmark} /></button>
      </nav>
    </div>
  );
}

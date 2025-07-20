// query selectors

const todoForm = document.querySelector("#todo-from")
const todoList = document.querySelector("#todos")

//helpers
const getLocalAsJson = (key) => (localStorage.getItem(key)?
  JSON.parse(localStorage.getItem(key)): [])

//custom events
const renderUI = new CustomEvent("renderUI");

//rendering
const createTodoHTML = (todo) => (
`<li class="todo">
  <div class="checkbox">
    <input type="checkbox" class="checkbox-input" 
    data-id="${todo.id}" id="${todo.id}" 
    ${todo.isCompleted ? "checked" : ""}/>
    <div class="fake-checkbox"></div>
    <label for="${todo.id}">${todo.text}</label>
  </div>
  <button class="delete-button" data-id="${todo.id}" aria-label="Delete ${todo.text} todo">❌</button>
</li>`)

//event listener
todoForm.addEventListener("submit", (e)=> {
  e.preventDefault();

  //1. get exisiting todos
  const existingTodos = getLocalAsJson("todos");
  
  //2. get new todo
  const newTodoName = new FormData(todoForm).get("todo")

  //3. combine them
  const updatedTodos = [...existingTodos, {
    id: new Date().getTime(),
    text: newTodoName,
    isCompleted: false,
  }]

  //4. save to storage
  localStorage.setItem("todos", JSON.stringify(updatedTodos));

  //5. update ui
  todoForm.reset();
  document.dispatchEvent(renderUI)
})

todoList.addEventListener("click", (e)=> {
  const { id }= e.target.dataset;
  if(!id) return;
  const existingTodos = getLocalAsJson("todos")
  // 1. update todo
  if(e.target.classList.contains("checkbox-input")){

    const updatedTodos = existingTodos.map((todo) =>
    todo.id === Number(id)?
    {...todo, isCompleted: !todo.isCompleted}
    : todo )
    localStorage.setItem("todos", JSON.stringify(updatedTodos))
  }

  // 2. delete todo
  if(e.target.classList.contains("delete-button")){

    const updatedTodos = existingTodos.filter((todo) =>
    todo.id !== Number(id))
    localStorage.setItem("todos", JSON.stringify(updatedTodos))
  }

  document.dispatchEvent(renderUI)
})

window.addEventListener("DOMContentLoaded", ()=> {
  document.dispatchEvent(renderUI);
})

document.addEventListener("renderUI", ()=>(
  todoList.innerHTML = getLocalAsJson("todos").map(createTodoHTML).join("")
))


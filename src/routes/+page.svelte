<script lang="ts">
	import { onMount } from "svelte";

  let todos: any[] = [];
  let loading = true;
  let editingId: string | null = null;
  let editForm = {
    title: '',
    description: '',
    priority: 0
  };

  const getTodos = async () => {
    const response = await fetch('/api/todos');
    todos = await response.json();
    loading = false;
  }

  onMount(() =>{
    getTodos();
  })

  const createTodo = async (formData: { title: string; description: string; priority: number }) => {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    console.log(data);
    getTodos();
  }

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const todoData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      priority: parseInt(formData.get('priority') as string, 10)
    };

    createTodo(todoData);
    form.reset();
  }

  const deleteTodo = async (id: string) => {
    await fetch(`/api/todos?id=${id}`, {
      method: 'DELETE'
    });
    getTodos();
  }

  const updateTodo = async (id: string, formData: { title: string; description: string; priority: number }) => {
    await fetch(`/api/todos?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    getTodos();
  }

  const startEdit = (todo: any) => {
    editingId = todo.id;
    editForm = {
      title: todo.title,
      description: todo.description,
      priority: todo.priority
    };
  }

  const cancelEdit = () => {
    editingId = null;
    editForm = { title: '', description: '', priority: 0 };
  }

  const saveEdit = async () => {
    if (editingId) {
      await updateTodo(editingId, editForm);
      cancelEdit();
    }
  }

</script>

<h1>Todos CRUD</h1>

<form class="form" onsubmit={handleSubmit}>
  <label class="label" for="title">Title</label>
  <input class="input" required type="text" name="title" placeholder="Title" />
  <label class="label" for="description">Description</label>
  <input class="input" type="text" name="description" placeholder="Description" />
  <label class="label" for="priority">Priority</label>
  <input class="input" required type="number" name="priority" placeholder="Priority" />
  <button class="button" type="submit">Create</button>
</form>

{#if loading}
  <p>Loading...</p>
{:else}
  <ul class="todos-list">
    {#each todos as todo}
      <li class="todo-item">
        {#if editingId === todo.id}
          <div class="todo-edit-form">
            <input
              class="edit-input"
              type="text"
              bind:value={editForm.title}
              placeholder="Title"
            />
            <input
              class="edit-input"
              type="text"
              bind:value={editForm.description}
              placeholder="Description"
            />
            <input
              class="edit-input"
              type="number"
              bind:value={editForm.priority}
              placeholder="Priority"
            />
            <div class="edit-actions">
              <button class="btn-save" onclick={saveEdit}>Guardar</button>
              <button class="btn-cancel" onclick={cancelEdit}>Cancelar</button>
            </div>
          </div>
        {:else}
          <div class="todo-content">
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <span class="priority">Priority: {todo.priority}</span>
          </div>
          <div class="todo-actions">
            <button onclick={() => deleteTodo(todo.id)}>Delete</button>
            <button onclick={() => startEdit(todo)}>Editar</button>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
    margin: 0 auto;
  }

  .input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  /* #path {
  color: rgb(0, 0, 0);
  display: block;
  padding: 0.25rem 0.5rem;
  margin-top: 0.5rem;
  margin-left: auto;
} */

  .button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .todos-list {
    list-style: none;
    padding: 0;
    max-width: 600px;
    margin: 2rem auto;
  }

  .todo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    background-color: #f9f9f9;
  }

  .todo-content h3 {
    margin: 0 0 0.5rem 0;
  }

  .todo-content p {
    margin: 0 0 0.5rem 0;
    color: #666;
  }

  .priority {
    color: #007bff;
    font-weight: bold;
  }

  .todo-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .todo-actions button {
    padding: 0.25rem 0.5rem;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .todo-actions button:hover {
    background-color: #e0e0e0;
  }

  .todo-edit-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .edit-input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .edit-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .btn-save {
    padding: 0.5rem 1rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .btn-save:hover {
    background-color: #218838;
  }

  .btn-cancel {
    padding: 0.5rem 1rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .btn-cancel:hover {
    background-color: #c82333;
  }
</style>
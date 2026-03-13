<script lang="ts">
	import { onMount } from "svelte";

  const getTodos = async () => {
    const response = await fetch('/api/todos');
    const data = await response.json();
    console.log(data);
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

  .button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
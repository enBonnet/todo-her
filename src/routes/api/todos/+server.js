import { db } from '$lib/server/db'
import { task } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// get *default* https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/GET
// return data or get data from the server
// get parameters in the url mostly query search params
export const GET = async () => {
    const tasks = await db.select().from(task);
    return new Response(JSON.stringify(tasks), {
        headers: { 'Content-Type': 'application/json' }
    });
}

// create https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/POST
// send data to the server
// get parameters in the url mostly query search params
// receives data in the body
/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
    const data = await request.json();
    const newTodo = await db.insert(task).values({
        title: data.title,
        description: data.description,
        priority: data.priority
    }).returning();
    return new Response(JSON.stringify({ message: 'Hello Created', todo: newTodo }));
}

// update https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PUT
// get parameters in the url mostly query search params
// receives data in the body
/** @type {import('./$types').RequestHandler} */
export const PUT = async ({ request, url }) => {
    const taskId = url.searchParams.get('id');
    
    if (!taskId) {
        return new Response(JSON.stringify({ error: 'Task ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    const data = await request.json();
    
    const updatedTask = await db.update(task)
        .set({
            title: data.title,
            description: data.description,
            priority: data.priority
        })
        .where(eq(task.id, taskId))
        .returning();
    
    return new Response(JSON.stringify({ message: 'Task updated', task: updatedTask }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

// delete https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/DELETE
// get query params -> in the url
export const DELETE = () => {
    return new Response(JSON.stringify({ message: 'Hello Delete' }));
}
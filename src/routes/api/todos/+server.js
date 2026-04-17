import { db } from '$lib/server/db'
import { task } from '$lib/server/db/schema';
// import type { _catch } from 'better-auth';
import { eq } from 'drizzle-orm'; 
import {duplicateTitle, sanitizeInput} from '$lib/util/task';



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
    
    // Validar que priority esté entre 0 y 10
    if (data.priority !== undefined && (data.priority < 0 || data.priority > 10)) {
        return new Response(JSON.stringify({ error: 'Priority must be between 0 and 10' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // Limpiar los espacios
    const sanitize =  sanitizeInput({title:data.title});
    if (!sanitize){ 
         return new Response(JSON.stringify({ error: 'Title already exists' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Verificar si el título ya existe
    const duplicate = await duplicateTitle({title:sanitize.title});
    if (duplicate ) {
        return new Response(JSON.stringify({ error: 'Title already exists' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    const newTodo = await db.insert(task).values({
        title: sanitize.title,
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
    
    // Validar que priority esté entre 0 y 10
    if (data.priority !== undefined && (data.priority < 0 || data.priority > 10)) {
        return new Response(JSON.stringify({ error: 'Priority must be between 0 and 10' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    // aca tengo la funcion pero no me esta validando el excludeId porq en la funcion de utilidad aun no lo declaro
    // Verificar si el título ya existe (excluyendo el actual)
    if (data.title) {
        const duplicate = await duplicateTitle({ title: data.title, excludeId: taskId });
          if  (duplicate) {
            return new Response(JSON.stringify({ error: 'Title already exists' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
    
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
/** @type {import('./$types').RequestHandler} */
    export const DELETE = async ({ url }) => {
        const taskId = url.searchParams.get('id');

        if (!taskId) {
            return new Response(JSON.stringify({ error: 'Task ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
     try {
        await db.delete(task).where(eq(task.id, taskId));
        return new Response(JSON.stringify({ message: 'Task deleted' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete task' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}; 

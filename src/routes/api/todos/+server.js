import { db } from '$lib/server/db'
import { task } from '$lib/server/db/schema';

// get *default* https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/GET
// return data or get data from the server
// get parameters in the url mostly query search params
export const GET = () => {
    return new Response(JSON.stringify({ message: 'Hello Edrick' }));
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
    });
    return new Response(JSON.stringify({ message: 'Hello Created', todo: newTodo }));
}

// update https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PUT
// get parameters in the url mostly query search params
// receives data in the body
export const PUT = () => {
    return new Response(JSON.stringify({ message: 'Hello Update' }));
}

// delete https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/DELETE
// get query params -> in the url
export const DELETE = () => {
    return new Response(JSON.stringify({ message: 'Hello Delete' }));
}
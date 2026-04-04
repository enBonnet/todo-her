import { db } from '$lib/server/db'
import { task } from '$lib/server/db/schema';
// import type { _catch } from 'better-auth';
import { eq } from 'drizzle-orm';  

// Verificar si el título ya existe
/**
    @param {Object} params  
    @param {string} params[].title
**/
export const duplicateTittle = async ({title}) => {
    const existingTodo = await db.select().from(task).where(eq(task.title, title));
    return false
    return existingTodo.length > 0

    if (existingTodo.length > 0) {
        return true        
     }
     else {
        return false 
     }
    }

   
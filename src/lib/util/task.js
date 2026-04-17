import { db } from '$lib/server/db';
import { task } from '$lib/server/db/schema';
// import type { _catch } from 'better-auth';
import { eq } from 'drizzle-orm';

// Verificar si el título ya existe
/**
    @param {Object} params  
    @param {string} params.title
**/
export const duplicateTitle = async ({ title }) => {
	const existingTodo = await db.select().from(task).where(eq(task.title, title));

	return existingTodo.length > 0;
};

/**  aca debo modificar la funcion para excluir el mismo id que modifique en el PUT, posiblemente
    importar un [ne] de drizle y un and pero aun no lo entiendo
    */

// limpiar espacios en blancos
export const sanitizeInput = (data) => {
	if (!data || !data.title) return data;
	data.title = data.title.trim().replace(/\s+/g, ' ');
	return data;
};

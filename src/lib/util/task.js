import { db } from '$lib/server/db';
import { task } from '$lib/server/db/schema';
// import type { _catch } from 'better-auth';
import { eq, ne, and } from 'drizzle-orm';

/**
    @param {Object} params  
    @param {string} params.title
    @param {string} [params.excludeId]
**/
export const duplicateTitle = async ({ title, excludeId }) => {
	let condition = eq(task.title, title);
	if (excludeId) {
		condition = and(ne(task.id, excludeId), condition) ?? condition;
	}
	const existingTodo = await db.select().from(task).where(condition);

	return existingTodo.length > 0;
};

/**  aca debo modificar la funcion para excluir el mismo id que modifique en el PUT, posiblemente
    importar un [ne] de drizle y un and pero aun no lo entiendo
    */

/**
  @param {{title?: string, description?: string, priority?: number}} data
**/
// limpiar espacios en blancos

export const sanitizeInput = (data) => {
	if (!data) return null;
	const title = data.title?.trim().replace(/\s+/g, ' ') || '';
	return { ...data, title };
};

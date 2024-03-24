import type { FastifyInstance } from 'fastify'

export async function animes(app: FastifyInstance) {
	app.register(require('./method/get'))
	app.register(require('./method/post'))
}

import fastify, { type FastifyReply, type FastifyRequest } from 'fastify'
import admin from 'firebase-admin'
import { animes } from './routes'

export const app = fastify()

admin.initializeApp({
	credential: admin.credential.cert(require('./serviceAccountKey.json')),
})

app.register(animes)

app.listen({ port: 3333 }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}

	console.log(`Run Server ${address}`)
})

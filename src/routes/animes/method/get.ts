import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import admin from 'firebase-admin'

export default async (app: FastifyInstance) => {
	// Buscar lista de animes, ou apenas um anime.
	app.get(
		'/animes/:uid',
		async (
			req: FastifyRequest<{ Params: { uid: string | null } }>,
			res: FastifyReply,
		) => {
			const { uid } = req.params

			try {
				// referecia da collection animes.
				const refCollectionAnimes = admin.firestore().collection('animes')
				// Get dos dados no DB.
				const snapshot = await refCollectionAnimes.get()
				// organizando a lista de animes.
				const animes = snapshot.docs.map((doc) => ({
					...doc.data(),
					uid: doc.id,
				}))
				// se UID existe, busca o anime pelo UID.
				if (uid) {
					// buscando pelo array o anime que tem o mesmo UID.
					const filterAnime = animes.filter((anime) => anime.uid === uid)
					// caso nao tenha anime com esse UID, retorna um error.
					if (!filterAnime.length) throw new Error('Nenhum anime com esse UID')
					// retorna o anime filtrado.
					return res.code(200).send(filterAnime[0])
				}
				// retorna todos os animes do DB.
				return res.code(200).send(animes)
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (error: any) {
				// se ouver error, retorar isso.
				console.log(error)
				return res.code(404).send({ message: error.message })
			}
		},
	)
}

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import admin from 'firebase-admin'

export default async (app: FastifyInstance) => {
	// Adicionando novos animes.
	app.post(
		'/animes/',
		async (
			req: FastifyRequest<{ Body: { name: string; ep: number } }>,
			res: FastifyReply,
		) => {
			// Destruturando os dados recebidos do front.
			const { name, ep } = req.body
			const data = {
				name,
				ep: Number(ep),
				completed: false,
			}

			// Caso o name estive vazio, retorna um error.
			if (!name) throw new Error('Name Invalido')

			// Caso o ep for diferente do que um numero positivo.
			if (!(Number(ep) >= 0)) {
				// Se o numero for negativo, multiplica por -1 para ficar positivo.
				if (Math.sign(ep) === -1) {
					data.ep = data.ep * -1
				}
				// Caso seja NaN, será 0.
				else {
					data.ep = 0
				}
			}

			// Tentando adicionar os dados no firestore.
			try {
				// Contruindo data que sera enviado.

				// Fazendo a conexao conexão com firestore, e abrindo uma ref com a tabela animes.
				const collectionRefAnimes = admin.firestore().collection('animes')
				// enviado a data com os dados para firestore.
				await collectionRefAnimes.add(data)
				// retorna um response com os valores da data criada.
				return res.code(200).send(data)

				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (error: any) {
				// se ouver error, retorar isso.
				console.log(error)
				return res.code(404).send({ message: error.message })
			}
		},
	)
}

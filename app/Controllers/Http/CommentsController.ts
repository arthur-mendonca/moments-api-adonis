import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import Moment from 'App/Models/Moment'

export default class CommentsController {
  public async store({ request, response, params }: HttpContextContract) {
    const body = request.body()
    const momentId = params.momentId

    await Moment.findOrFail(momentId)

    body.momentId = momentId

    const comment = await Comment.create(body)

    response.status(201)

    return {
      message: 'Comentário adicionado com sucesso!',
      data: comment,
    }
  }

  public async index() {
    const comments = await Comment.all()
    return { data: comments }
  }

  public async show({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.momentId)

    const comment = await moment.related('comments').query().where('id', params.id).firstOrFail()

    return { data: comment }
  }

  public async destroy({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.momentId)
    const comment = await moment.related('comments').query().where('id', params.id).firstOrFail()

    await comment.delete()

    return { message: 'Comentário excluido com sucesso!' }
  }

  public async update({ params, request }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.momentId)
    const comment = await moment.related('comments').query().where('id', params.id).firstOrFail()

    const body = request.body()

    if (comment && body.text !== comment.text) {
      comment.text = body.text

      await comment.save()
    }

    return { message: 'Comentário atualizado com sucesso!', data: comment }
  }
}

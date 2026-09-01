import { HTTP_METHOD, ResourceMethods } from '@/types/api'

import { Models } from '../models'
import { clientResource } from '../resource'

const path = '/v1/comments'
const methods = [HTTP_METHOD.GET, HTTP_METHOD.POST, HTTP_METHOD.PUT, HTTP_METHOD.DELETE]

export const commentServices: ResourceMethods<Models.Comment> = clientResource(path, methods)

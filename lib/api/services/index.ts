import { categoryServices } from './category'
import { commentServices } from './comment'
import { mediaServices } from './media'
import { osmServices } from './osm'
import { pageServices } from './page'
import { postServices } from './post'
import { roleServices } from './role'
import { tagServices } from './tag'
import { userServices } from './user'

export const services = {
  categories: categoryServices,
  comments: commentServices,
  media: mediaServices,
  osm: osmServices,
  pages: pageServices,
  posts: postServices,
  roles: roleServices,
  tags: tagServices,
  users: userServices,
} as const

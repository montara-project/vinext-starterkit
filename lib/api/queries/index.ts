import { accountQueries } from './account'
import { categoryQueries } from './category'
import { commentQueries } from './comment'
import { mediaQueries } from './media'
import { osmQueries } from './osm'
import { pageQueries } from './page'
import { postQueries } from './post'
import { roleQueries } from './role'
import { tagQueries } from './tag'
import { userQueries } from './user'

export const queries = {
  account: accountQueries,
  categories: categoryQueries,
  comments: commentQueries,
  media: mediaQueries,
  osm: osmQueries,
  pages: pageQueries,
  posts: postQueries,
  roles: roleQueries,
  tags: tagQueries,
  users: userQueries,
} as const

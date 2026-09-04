/* eslint-disable @typescript-eslint/no-namespace */

import { Category as CategoryModel } from './category'
import { Comment as CommentModel } from './comment'
import { Media as MediaModel } from './media'
import { Page as PageModel } from './page'
import { Post as PostModel } from './post'
import { Role as RoleModel } from './role'
import { Tag as TagModel } from './tag'
import { User as UserModel } from './user'

export namespace Models {
  export type Category = CategoryModel
  export type Comment = CommentModel
  export type Media = MediaModel
  export type Page = PageModel
  export type Post = PostModel
  export type Role = RoleModel
  export type Tag = TagModel
  export type User = UserModel
}

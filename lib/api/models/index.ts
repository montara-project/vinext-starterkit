/* eslint-disable @typescript-eslint/no-namespace */

import { Category as CategoryModel } from './category'
import { Role as RoleModel } from './role'
import { User as UserModel } from './user'

export namespace Models {
  export type Category = CategoryModel
  export type Role = RoleModel
  export type User = UserModel
}

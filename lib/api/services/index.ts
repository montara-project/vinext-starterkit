import { categoryServices } from './category'
import { osmServices } from './osm'

export const services = {
  categories: categoryServices,
  osm: osmServices,
} as const

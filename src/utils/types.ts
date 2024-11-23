export interface QueryObjectType {
  name?: string
  country?: string
  updatedAt?: string
  difficulty?: string
  sort?: string
  visibility?: "isFeatured" | "isPopular" | "isNewItem" | "isRecommended"
  [key: string]: string | undefined
}

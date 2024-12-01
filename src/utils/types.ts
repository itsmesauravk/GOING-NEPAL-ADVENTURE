export interface QueryObjectType {
  name?: string
  country?: string
  updatedAt?: string
  difficulty?: string
  sort?: string
  visibility?: "isFeatured" | "isPopular" | "isNewItem" | "isRecommended"
  [key: string]: string | undefined
}

export interface BlogQueryObjectType {
  title?: string
  createdAt?: string
  sort?: string
  search?: string
  visibility?: "isNewBlog" | "isActive"
  [key: string]: string | undefined
}

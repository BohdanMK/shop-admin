
export interface ISubCategoriesDTO {
    _id?: string,
    id: string
    title: string;
    pathName: string,
    parentCategory: string
}

export interface ICategoryInfoDTO {
    _id?: string,
    id: string
    title: string;
    pathName: string,
    image?: string,
    imageId?: string | null,
    createdAt?: string,
    subCategories?: ISubCategoriesDTO[]
}


import * as z from 'zod'


export const signUpSchema=z.object({
    username:z.string().min(3,{ message: "Username shuld atleast be of  3 length" }),
    password:z.string(),
    type:z.enum(["user","admin"])
})
export const signInSchema=z.object({
    username:z.string(),
    password:z.string()
})
export const updateMetadataSchema=z.object({
    avatarId:z.string()
})
//regex(/^[0-9]{1,4}[x,c]][0,9]{1,4}$/), for optional like x or c in b/w [0-9]--> range of number {1,4}--> max 4 digit allwed like 9999x8888
export const createSpaceSchema=z.object({
    name:z.string(),
    dimensions:z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId:z.string().optional()
})
export const addElementSchema=z.object({
    elementId:z.string(),
    spaceId:z.string(),
    x:z.number(),
    y:z.number()
})
export const deleteElementSchema=z.object({
    id:z.string()
})
export const  createElementSchema=z.object({
imageUrl:z.string(),
width:z.number(),
height:z.number(),
static:z.boolean()
})
//check if this works
export const updateElementSchema=z.object({
imageUrl:z.string()
})
export const createAvatarSchema=z.object({
imageUrl:z.string(),
name:z.string()
})
// use .refine for more limits like min,max value of number  and if it fails throw error message
//   .refine((val) => {
//     const [w, h] = val.split("x").map(Number)
//     return w >= 50 && h >= 50 && w <= 2000 && h <= 2000
//   }, { message: "Width and height must be 50-2000" })

export const createMapSchema=z.object({
    thumbnail:z.string(),
    dimensions:z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    name:z.string(),
    defaultElements:z.array(z.object({
        elementId:z.string(),
        x:z.number(),
        y:z.number()
    })) 
})


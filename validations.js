import { body } from 'express-validator';

 export const registerValidation = [
    body('email', 'Invalid mail format').isEmail(),
    body('password', 'Name must contain at least 5 characters').isLength({ min: 5}),
    body('fullName', 'Name must contain at least 3 characters').isLength({ min: 3}),
    body('avatarUrl', 'Invalid Url').optional().isURL({require_tld:false}),
];

export const loginValidation = [
    body('email', 'Invalid mail format').isEmail(),
    body('password', 'Name must contain at least 5 characters').isLength({ min: 5})
];

export const postCreateValidation = [
    body('title','Enter article title').isLength({ min: 3}).isString(),
    body('text', 'Enter text of article').isLength({ min: 10}).isString(),
    body('tags', 'Invalid format of tag').optional().isString(),
    body('imageUrl', 'Invalid image link').optional().isString()
];
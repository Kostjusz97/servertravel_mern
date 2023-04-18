import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';

import { registerValidation, loginValidation } from './validations.js';
import { UserController, PostController } from './controllers/index.js'
import { postCreateValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const storageAvatar = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'avatars');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage, limits: { fileSize: 5 * 1024 * 1024 }});
const avatar = multer({storage: storageAvatar, limits: { fileSize: 5 * 1024 * 1024 }});

app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'));
app.use('/avatars', express.static('avatars'));

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
});

app.post('/avatar', avatar.single('avatar'), (req, res) => {
    res.json({
        url: `${process.env.REACT_APP_API_URL}/avatars/${req.file.originalname}`,
    })
});

app.delete('/avatar/:avatarId', (req, res) => {
    const { avatarId } = req.params;
    const filePath = `avatars/${avatarId}`;
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server error');
      } else {
        res.send(`File ${filePath} deleted successfully`);
      }
    });
  });


app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server Ok');
});
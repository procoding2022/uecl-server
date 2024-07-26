import express from 'express';
import { loginUser , newsletterEE , formSubmit , userSignup , newsletterFetch ,userfetch,updateUser,deleteUser,contactUsFetch,postFetch,getPostById} from '../controller/user-controller.js';
import upload from '../utils/upload.js';
import { uploadImage } from '../controller/image-controller.js';
import { updatePost } from '../controller/updatePost.js';
import { deletePost } from '../controller/deletepost.js';

const router = express.Router();

// Define routes
router.post('/login',loginUser);
router.post('/newsletter',newsletterEE);
router.post('/contact-us',formSubmit);
router.post('/user/userSignup',userSignup);
router.get('/user/newsletterFetch', newsletterFetch);
router.get('/user/userfetch',userfetch);
router.put('/user/updateUser',updateUser);
router.delete('/user/deleteUser/:username',deleteUser);
router.get('/user/ContactUsfetch',contactUsFetch);
router.post('/user/file/upload', upload.single('file'), uploadImage);
router.get('/user/postfetch',postFetch);
router.get('/user/post/:id', getPostById);
router.put('/user/updatePost', updatePost);
router.delete('/user/deletePost/:title', deletePost);
export default router;
import { NextFunction, Request, Response, Router } from 'express';
import cloudinary from '../utils/cloudinary';
import upload from '../utils/multer';
import User from '../model/user';

import auth from '../middleware/auth';
export const ImagesController: Router = Router();

// @ts-expect-error
ImagesController.get('/:userId', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { imageIds } = req.body;

    const user = await User.findById(userId);
    if (user === null) return res.status(404).send('User not found');

    let result;

    if (!imageIds || imageIds.length === 0) result = await cloudinary.api.resources({ type: 'upload', prefix: `shopify/${userId}/`, max_results: 50 });
    else result = await cloudinary.api.resources_by_ids([...imageIds]);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// @ts-expect-error
ImagesController.post('/:userId', [auth, upload.array('image', process.env.MAX_FILE_COUNT | 30)], async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Upload image to cloudinary
    const { userId } = req.params;
    const pictureFiles = req.files;
    // Check if files exist
    if (!pictureFiles) return res.status(400).json({ message: 'No picture attached!' });
    // map through images and create a promise array using cloudinary upload function

    const user = await User.findById(userId);
    if (user === null) return res.status(404).send('User not found');

    // @ts-expect-error
    const multiplePicturePromise = pictureFiles.map((picture) => cloudinary.uploader.upload(picture.path, { folder: `shopify/${userId}/` }));

    // await all the cloudinary upload functions in promise.all
    const imageResponses = await Promise.all(multiplePicturePromise);
    res.status(200).json({ images: imageResponses });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// @ts-expect-error
ImagesController.delete('/deleteAll/:userId', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    // Find user by id
    const user = await User.findById(userId);
    if (user === null) return res.status(404).send('User not found');

    // Delete images from cloudinary
    const result = await cloudinary.api.delete_resources_by_prefix(`shopify/${userId}/`);
    res.json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// @ts-expect-error
ImagesController.delete('/delete/:userId', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { imageIds } = req.body;

    if (!imageIds || imageIds.length < 1) return res.status(400).send('No images to delete');

    // Find user by id
    const user = await User.findById(userId);
    if (user === null) return res.status(404).send('User not found');

    // Delete images from cloudinary
    const result = await cloudinary.api.delete_resources([...imageIds]);

    res.json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

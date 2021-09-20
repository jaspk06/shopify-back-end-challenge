import { NextFunction, Request, Response, Router } from 'express';
import User from '../model/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../utils/cloudinary';
import auth from '../middleware/auth';

export const UserController: Router = Router();

UserController.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      return res.status(400).send('All input is required');
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login');
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword
    });
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY!,
      { expiresIn: '2h' }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json({ token: user.token, id: user._id });
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

UserController.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send('All input is required');
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (!user) return res.status(404).send('User not found');

    if (await bcrypt.compare(password, user.password)) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY!,
        {
          expiresIn: '2h'
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json({ token: user.token, id: user._id });
    } else {
      res.status(400).send('Invalid Credentials');
    }
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

// @ts-expect-error
UserController.delete('/delete', auth, async (req: Request, res: Response, next: NextFunction) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send('All input is required');
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (!user) return res.status(404).send('User not found');

    if (await bcrypt.compare(password, user.password)) {
      // Create token
      user.delete();
      await cloudinary.api.delete_resources_by_prefix(`shopify/${user._id}/`);
      // user
      res.status(200).send('Successfully deleted');
    } else {
      res.status(400).send('Invalid Credentials');
    }
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

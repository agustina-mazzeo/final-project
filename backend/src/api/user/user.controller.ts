import { Request, Response } from 'express';
class UserController {
  public createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.body;
      res.status(200).send(user);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  };
}

export default UserController;

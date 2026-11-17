import { Application, Request, Response, NextFunction } from 'express'
import { ServiceFactory } from '../../service-layer/ServiceFactory'
import { UserResponse } from '../models/response/UserResponse'

export function mountWebRoutes(app: Application): void {
  const getUserService = () => ServiceFactory.getUserService()

  app.get('/', (_req: Request, res: Response) => {
    res.render('login')
  })

  app.get('/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const phoneNumber = req.query.pnumber as string
      const password = req.query.password as string
      const user = await getUserService().authenticate(phoneNumber, password)
      if (user) {
        const users = await getUserService().getUserWithDetails(phoneNumber)
        const responses = users.map((u) => new UserResponse(u))
        res.render('user', { userData: responses })
      } else {
        res.render('addUser')
      }
    } catch (err) {
      next(err)
    }
  })

  app.post('/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getUserService().registerUser(req.body)
      res.render('login')
    } catch (err) {
      next(err)
    }
  })

  app.post('/update', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getUserService().updateUser(req.body)
      res.render('login')
    } catch (err) {
      next(err)
    }
  })

  app.get('/userDelete', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getUserService().deleteUser(req.query._id as string)
      res.render('login')
    } catch (err) {
      next(err)
    }
  })

  app.get('/userBlock', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getUserService().toggleBlockUser(req.query._id as string)
      res.render('login')
    } catch (err) {
      next(err)
    }
  })

  app.get('/userUpdate', (_req: Request, res: Response) => {
    res.render('updateUser')
  })

  app.get('/allUsers', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await getUserService().getAllUsers()
      const responses = users.map((u) => new UserResponse(u))
      res.render('allUsers', { data: responses })
    } catch (err) {
      next(err)
    }
  })

  app.get('/showByPhoneNo', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const phoneNumber = req.query.phoneNumber_no as string
      const users = await getUserService().getUserWithDetails(phoneNumber)
      const responses = users.map((u) => new UserResponse(u))
      res.render('usersList', { data: responses })
    } catch (err) {
      next(err)
    }
  })
}

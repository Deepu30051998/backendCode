"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mountWebRoutes = mountWebRoutes;
const ServiceFactory_1 = require("../../service-layer/ServiceFactory");
const UserResponse_1 = require("../models/response/UserResponse");
function mountWebRoutes(app) {
    const getUserService = () => ServiceFactory_1.ServiceFactory.getUserService();
    app.get('/', (_req, res) => {
        res.render('login');
    });
    app.get('/user', async (req, res, next) => {
        try {
            const phone = req.query.pnumber;
            const pass = req.query.pass;
            const user = await getUserService().authenticate(phone, pass);
            if (user) {
                const users = await getUserService().getUserWithDetails(phone);
                const responses = users.map((u) => new UserResponse_1.UserResponse(u));
                res.render('user', { userData: responses });
            }
            else {
                res.render('addUser');
            }
        }
        catch (err) {
            next(err);
        }
    });
    app.post('/user', async (req, res, next) => {
        try {
            await getUserService().registerUser(req.body);
            res.render('login');
        }
        catch (err) {
            next(err);
        }
    });
    app.post('/update', async (req, res, next) => {
        try {
            await getUserService().updateUser(req.body);
            res.render('login');
        }
        catch (err) {
            next(err);
        }
    });
    app.get('/userDelete', async (req, res, next) => {
        try {
            await getUserService().deleteUser(req.query._id);
            res.render('login');
        }
        catch (err) {
            next(err);
        }
    });
    app.get('/userBlock', async (req, res, next) => {
        try {
            await getUserService().toggleBlockUser(req.query._id);
            res.render('login');
        }
        catch (err) {
            next(err);
        }
    });
    app.get('/userUpdate', (_req, res) => {
        res.render('updateUser');
    });
    app.get('/allUsers', async (_req, res, next) => {
        try {
            const users = await getUserService().getAllUsers();
            const responses = users.map((u) => new UserResponse_1.UserResponse(u));
            res.render('allUsers', { data: responses });
        }
        catch (err) {
            next(err);
        }
    });
    app.get('/showByPhoneNo', async (req, res, next) => {
        try {
            const phone = req.query.phone_no;
            const users = await getUserService().getUserWithDetails(phone);
            const responses = users.map((u) => new UserResponse_1.UserResponse(u));
            res.render('usersList', { data: responses });
        }
        catch (err) {
            next(err);
        }
    });
}

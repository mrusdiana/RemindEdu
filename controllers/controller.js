const { timeRemaining, checkUrgency, countUrgentTasks } = require('../helpers/helper');
const { User, Task } = require('../models/index')
const bcrypt = require('bcrypt');

class Controller {

    static async homePage(req, res) {
        try {
            res.render('homePage')
        } catch (error) {
            res.send(error)
        }
    }

    static async getRegister(req, res) {
        try {
            res.render('register', { error: req.query.error || null });
        } catch (error) {
            res.send(error);
        }
    }

    static async studentDashboard(req, res) {
        try {
            let tasks = await Task.findAll({ where: { userId: req.session.userId } });
            let user = await User.findByPk(req.session.userId)
            let taskCompleted = await Task.findAll({ where: { userId: req.session.userId, isCompleted: true } })
            let taskUnfinish = await Task.findAll({ where: { userId: req.session.userId, isCompleted: false } })

            const today = new Date();   // ← ini WAJIB ada, cek lagi apa masih ada di file kamu

            const calMonth = req.query.month !== undefined ? parseInt(req.query.month) : today.getMonth();
            const calYear = req.query.year !== undefined ? parseInt(req.query.year) : today.getFullYear();


            console.log(user);


            console.log(tasks);
            console.log(taskCompleted);
            console.log(taskUnfinish);
            res.render('dashboard', { tasks, role: 'student', user, taskCompleted, taskUnfinish, timeRemaining, checkUrgency, countUrgentTasks, calMonth, calYear });
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async adminDashboard(req, res) {
        try {
            res.send('Admin')
            // const tasks = await Task.findAll({ include: 'User' }); // semua task, semua user
            // res.render('dashboard', { tasks, role: 'admin' });
        } catch (error) {
            res.send(error);
        }
    }

    static async manageUsers(req, res) {
        try {
            const users = await User.findAll();
            res.render('manageUsers', { users });
        } catch (error) {
            res.send(error);
        }
    }

    static async postRegister(req, res) {
        try {
            const { name, email, password, role } = req.body;

            await User.create({ name, email, password, role });

            res.redirect('/login');
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                return res.redirect(`/register?error=${encodeURIComponent(error.errors[0].message)}`);
            }
            res.send(error);
        }
    }

    static async login(req, res) {
        try {
            res.render('login', { error: req.query.error || null });
        } catch (error) {
            res.send(error);
        }
    }

    static async postLogin(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            const users = await User.findAll()

            // console.log(user, "<<<");
            // console.log(users);

            if (!user || !(await user.comparePassword(password))) {
                return res.redirect('/login?error=Email atau password salah'); // Pakai return
            }

            req.session.userId = user.id;
            req.session.role = user.role;

            if (user.role === 'admin') {
                return res.redirect('/admin'); // Pakai return
            }

            return res.redirect('/student'); // Pakai return
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }

    static async logout(req, res) {
        try {
            req.session.destroy();
            res.redirect('/login');
        } catch (error) {
            res.send(error);
        }
    }

    static async dashboard(req, res) {
        try {

        } catch (error) {
            res.send(error)
        }
    }

    static async socialFeed(req, res) {
        try {

        } catch (error) {
            res.send(error)
        }
    }

    static async getAddTask(req, res) {
        try {
            
            let {id} = req.params

            res.render('addTask', {id})
        } catch (error) {
            res.send(error)
        }
    }

    static async postAddTask(req, res) {
        try {  

            let {title, courseName, deadline} = req.body
            await Task.create({
                title, 
                courseName, 
                deadline,
                userId: req.params.id
            }, {
                where: {
                    userId: req.params.id
                }
            })

            res.redirect('/student')
        } catch (error) {
            res.send(error)
        }
    }

    static async getEditTask(req, res) {
        try {

        } catch (error) {
            res.send(error)
        }
    }

    static async postEditTask(req, res) {
        try {

        } catch (error) {
            res.send(error)
        }
    }

    static async getAddFeed(req, res) {
        try {

        } catch (error) {
            res.send(error)
        }
    }

    static async postAddFeed(req, res) {
        try {

        } catch (error) {
            res.send(error)
        }
    }

    static async getEditFeed(req, res) {
        try {

        } catch (error) {
            res.send(error)
        }
    }

    static async postEditFeed(req, res) {
        try {

        } catch (error) {
            res.send(error)
        }
    }

    static async taskCompleted(req, res) {
        try {

        } catch (error) {
            res.send(error)
        }
    }

    static async deleteFeed(req, res) {
        try {

        } catch (error) {
            res.send(error)
        }
    }

    static async deleteTask(req, res) {
        try {

        } catch (error) {
            res.send(error)
        }
    }

    static async profile(req, res) {
        try {

        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = Controller
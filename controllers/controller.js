const { timeRemaining, checkUrgency, countUrgentTasks } = require('../helpers/helper');
const { User, Task, Post, Profile } = require('../models/index')
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


            res.render('dashboard', { tasks, role: 'student', user, taskCompleted, taskUnfinish, timeRemaining, checkUrgency, countUrgentTasks, calMonth, calYear });
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async adminDashboard(req, res) {
        try {
            const totalUsers = await User.count();
            const totalTasks = await Task.count();
            const totalPosts = await Post.count();
            const completedTasks = await Task.count({ where: { isCompleted: true } });
            res.render('adminDashboard', { totalUsers, totalTasks, totalPosts, completedTasks });
        } catch (error) {
            res.send(error);
        }
    }

    static async manageUsers(req, res) {
        try {
            const users = await User.findAll({ order: [['id', 'ASC']] });
            res.render('manageUsers', { users, sessionUserId: req.session.userId });
        } catch (error) {
            res.send(error);
        }
    }

    static async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!['student', 'admin'].includes(role)) {
                return res.status(400).send('Role tidak valid.');
            }

            // admin tidak boleh mengubah role akunnya sendiri agar tidak terkunci
            if (Number(id) === req.session.userId) {
                return res.status(403).send('Tidak bisa mengubah role akun sendiri.');
            }

            await User.update({ role }, { where: { id } });
            res.redirect('/admin/users');
        } catch (error) {
            res.send(error);
        }
    }

    static async postRegister(req, res) {
        try {
            const { name, email, password } = req.body;

            // role tidak boleh diambil dari input user — semua pendaftar adalah student
            await User.create({ name, email, password, role: 'student' });

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
            // let {error} = decodeURIComponent(req.query)
           
            res.render('login', { error: req.query.error || null});
        } catch (error) {
            res.send(error);
        }
    }

    static async postLogin(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

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
            req.session.destroy(() => {
                res.redirect('/login');
            });
        } catch (error) {
            res.send(error);
        }
    }

    static async socialFeed(req, res) {
        try {
            const isAdmin = req.session.role === 'admin';
            const posts = await Post.findAll({
                include: [{ model: User }],
                order: [['createdAt', 'DESC']]
            });
            res.render('socialFeed', {
                posts,
                sessionUserId: req.session.userId,
                isAdmin,
                basePath: isAdmin ? '/admin' : '/student'
            });
        } catch (error) {
            res.send(error);
        }
    }

    static async getAddTask(req, res) {
        try {

            let {id} = req.params

            res.render('addTask', {id, error: req.query.error || null})
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
                userId: req.session.userId
            })

            res.redirect('/student')
        } catch (error) {
            res.send(error)
        }
    }

    static async getEditTask(req, res) {
        try {
            const isAdmin = req.session.role === 'admin';
            // admin boleh mengedit task siapa pun; student hanya miliknya sendiri
            const where = isAdmin
                ? { id: req.params.id }
                : { id: req.params.id, userId: req.session.userId };

            let task = await Task.findOne({ where })

            if (!task) {
                return res.status(404).send('Task tidak ditemukan atau bukan milik Anda.')
            }

            res.render('editTask', { task, basePath: isAdmin ? '/admin' : '/student' })

        } catch (error) {
            res.send(error)
        }
    }

    static async postEditTask(req, res) {
        try {
            const isAdmin = req.session.role === 'admin';
            const where = isAdmin
                ? { id: req.params.id }
                : { id: req.params.id, userId: req.session.userId };

            let {title, courseName, deadline} = req.body

            await Task.update({
                title,
                courseName,
                deadline,
            }, { where })

            res.redirect(isAdmin ? '/admin' : '/student')

        } catch (error) {
            res.send(error)
        }
    }

    static async getAddFeed(req, res) {
        try {
            res.render('addFeed');
        } catch (error) {
            res.send(error);
        }
    }

    static async postAddFeed(req, res) {
        try {
            const { content } = req.body;
            await Post.create({ content, userId: req.session.userId });
            res.redirect('/student/feeds');
        } catch (error) {
            res.send(error);
        }
    }

    static async getEditFeed(req, res) {
        try {
            const isAdmin = req.session.role === 'admin';
            const { id } = req.params;
            // admin boleh mengedit post siapa pun; student hanya miliknya sendiri
            const where = isAdmin ? { id } : { id, userId: req.session.userId };
            const post = await Post.findOne({ where });
            if (!post) return res.status(404).send('Post tidak ditemukan atau bukan milik Anda.');
            res.render('editFeed', { post, basePath: isAdmin ? '/admin' : '/student' });
        } catch (error) {
            res.send(error);
        }
    }

    static async postEditFeed(req, res) {
        try {
            const isAdmin = req.session.role === 'admin';
            const { id } = req.params;
            const where = isAdmin ? { id } : { id, userId: req.session.userId };
            const { content } = req.body;
            await Post.update({ content }, { where });
            res.redirect(isAdmin ? '/admin/feeds' : '/student/feeds');
        } catch (error) {
            res.send(error);
        }
    }

    static async taskCompleted(req, res) {
        try {
            const { id } = req.params;

            // ambil task, pastikan milik user yang login
            const task = await Task.findOne({
                where: { id, userId: req.session.userId }
            });

            if (!task) {
                return res.status(404).send('Task tidak ditemukan atau bukan milik Anda.');
            }

            // toggle isCompleted
            await Task.update(
                { isCompleted: !task.isCompleted },
                { where: { id, userId: req.session.userId } }
            );

            res.redirect('/student');
        } catch (error) {
            res.send(error);
        }
    }

    static async deleteFeed(req, res) {
        try {
            const isAdmin = req.session.role === 'admin';
            const { id } = req.params;
            const where = isAdmin ? { id } : { id, userId: req.session.userId };
            await Post.destroy({ where });
            res.redirect(isAdmin ? '/admin/feeds' : '/student/feeds');
        } catch (error) {
            res.send(error);
        }
    }

    static async deleteTask(req, res) {
        try {
            const isAdmin = req.session.role === 'admin';
            const { id } = req.params;
            const where = isAdmin ? { id } : { id, userId: req.session.userId };
            await Task.destroy({ where })

            res.redirect(isAdmin ? '/admin' : '/student')
        } catch (error) {
            res.send(error)
        }
    }

    static async profile(req, res) {
        try {
            const user = await User.findByPk(req.session.userId, {
                include: [{ model: Profile }]
            });
            res.render('profile', { user });
        } catch (error) {
            res.send(error);
        }
    }
}

module.exports = Controller
const { timeRemaining, checkUrgency } = require('../helpers/helper');
const { User, Task, Post, Profile, Hastag } = require('../models/index')
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

function validationMessages(error) {
    return error.errors.map(e => e.message).join(',');
}

async function syncPostHashtags(post) {
    const matches = (post.content || '').match(/#([\p{L}\p{N}_]+)/gu) || [];
    const names = [...new Set(matches.map(tag => tag.slice(1).toLowerCase()))];

    const tags = [];
    for (const name of names) {
        const [tag] = await Hastag.findOrCreate({ where: { name } });
        tags.push(tag);
    }

    await post.setHastags(tags);
}

class Controller {

    static async homePage(req, res) {
        try {
            res.render('homePage')
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async getRegister(req, res) {
        try {
            res.render('register', { error: req.query.error || null });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async studentDashboard(req, res) {
        try {
            let tasks = await Task.findAll({ where: { userId: req.session.userId } });
            let user = await User.findByPk(req.session.userId)
            let taskCompleted = await Task.findAll({ where: { userId: req.session.userId, isCompleted: true } })
            let taskUnfinish = await Task.findAll({ where: { userId: req.session.userId, isCompleted: false } })
            let nowDate = await Task.nowDate()

            const today = new Date();   

            const calMonth = req.query.month !== undefined ? parseInt(req.query.month) : today.getMonth();
            const calYear = req.query.year !== undefined ? parseInt(req.query.year) : today.getFullYear();


            res.render('dashboard', { tasks, role: 'student', user, taskCompleted, taskUnfinish, timeRemaining, checkUrgency, calMonth, calYear, nowDate });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
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
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async manageUsers(req, res) {
        try {
            const users = await User.findAll({ order: [['id', 'ASC']] });
            res.render('manageUsers', { users, sessionUserId: req.session.userId });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!['student', 'admin'].includes(role)) {
                return res.status(400).send('Role tidak valid.');
            }

            if (Number(id) === req.session.userId) {
                return res.status(403).send('Tidak bisa mengubah role akun sendiri.');
            }

            const target = await User.findByPk(id);
            if (!target) {
                return res.status(404).send('User tidak ditemukan.');
            }
            if (target.role === 'admin' && role === 'student') {
                const adminCount = await User.count({ where: { role: 'admin' } });
                if (adminCount <= 1) {
                    return res.status(400).send('Tidak bisa menurunkan admin terakhir.');
                }
            }

            await User.update({ role }, { where: { id } });
            res.redirect('/admin/users');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async postRegister(req, res) {
        try {
            const { name, email, password } = req.body;

            await User.create({ name, email, password, role: 'student' });

            res.redirect('/login');
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                return res.redirect(`/register?error=${encodeURIComponent(validationMessages(error))}`);
            }
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async login(req, res) {
        try {
            // let {error} = decodeURIComponent(req.query)

            res.render('login', { error: req.query.error || null });
        } catch (error) {
            // console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async postLogin(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.redirect('/login?error=Email dan password wajib diisi');
            }

            const user = await User.findOne({ where: { email } });

            if (!user || !(await user.comparePassword(password))) {
                return res.redirect('/login?error=Email atau password salah'); 
            }

            req.session.userId = user.id;
            req.session.role = user.role;

            if (user.role === 'admin') {
                return res.redirect('/admin'); 
            }

            return res.redirect('/student');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async logout(req, res) {
        try {
            req.session.destroy(() => {
                res.redirect('/login');
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async socialFeed(req, res) {
        try {
            const { search } = req.query;
            const isAdmin = req.session.role === 'admin';


            const options = {
                where: {},
                include: [
                    { model: User },
                    { model: Hastag, through: { attributes: [] } }
                ],
                order:
                    [['createdAt', 'DESC']]
            };

            if (search) {
                const term = search.trim().replace(/^#/, '');

                const matchedTags = await Hastag.findAll({
                    where: { name: { [Op.iLike]: `%${term}%` } },
                    include: { model: Post, attributes: ['id'], through: { attributes: [] } }
                });
                const tagPostIds = matchedTags.flatMap(tag => tag.Posts.map(p => p.id));

                options.where = {
                    [Op.or]: [
                        { content: { [Op.iLike]: `%${search}%` } },
                        { id: { [Op.in]: tagPostIds } }
                    ]
                };
            }

            let posts = await Post.findAll(options);
            const user = await User.findByPk(req.session.userId);

            res.render('socialFeed', {
                posts,
                user,
                search: search || '',
                sessionUserId: req.session.userId,
                isAdmin,
                basePath: isAdmin ? '/admin' : '/student',
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async getAddTask(req, res) {
        try {

            let { id } = req.params

            res.render('addTask', { id, error: req.query.error || null })
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async postAddTask(req, res) {
        try {

            let { title, courseName, deadline, description } = req.body
            await Task.create({
                title,
                courseName,
                deadline: deadline || null,
                description,
                userId: req.session.userId
            })

            res.redirect('/student')
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                return res.redirect(`/student/tasks/${req.params.id}/add?error=${encodeURIComponent(validationMessages(error))}`);
            }
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async getEditTask(req, res) {
        try {
            const isAdmin = req.session.role === 'admin';
            const where = isAdmin
                ? { id: req.params.id }
                : { id: req.params.id, userId: req.session.userId };

            let task = await Task.findOne({ where })

            if (!task) {
                return res.status(404).send('Task tidak ditemukan atau bukan milik Anda.')
            }

            res.render('editTask', { task, basePath: isAdmin ? '/admin' : '/student', error: req.query.error || null })

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async postEditTask(req, res) {
        try {
            const isAdmin = req.session.role === 'admin';
            const where = isAdmin
                ? { id: req.params.id }
                : { id: req.params.id, userId: req.session.userId };

            let { title, courseName, deadline, description } = req.body

            const task = await Task.findOne({ where })
            if (!task) {
                return res.status(404).send('Task tidak ditemukan atau bukan milik Anda.')
            }

            await task.update({
                title,
                courseName,
                deadline: deadline || null,
                description,
            })

            res.redirect(isAdmin ? '/admin' : '/student')

        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const base = req.session.role === 'admin' ? '/admin' : '/student';
                return res.redirect(`${base}/tasks/${req.params.id}/edit?error=${encodeURIComponent(validationMessages(error))}`);
            }
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async getAddFeed(req, res) {
        try {
            res.render('addFeed', { error: req.query.error || null });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async postAddFeed(req, res) {
        try {
            const { content } = req.body;
            const post = await Post.create({ content, userId: req.session.userId });
            await syncPostHashtags(post);
            res.redirect('/student/feeds');
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                return res.redirect(`/student/feeds/add?error=${encodeURIComponent(validationMessages(error))}`);
            }
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async getEditFeed(req, res) {
        try {
            const isAdmin = req.session.role === 'admin';
            const { id } = req.params;
            const where = isAdmin ? { id } : { id, userId: req.session.userId };
            const post = await Post.findOne({ where });
            if (!post) return res.status(404).send('Post tidak ditemukan atau bukan milik Anda.');
            res.render('editFeed', { post, basePath: isAdmin ? '/admin' : '/student', error: req.query.error || null });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async postEditFeed(req, res) {
        try {
            const isAdmin = req.session.role === 'admin';
            const { id } = req.params;
            const where = isAdmin ? { id } : { id, userId: req.session.userId };
            const { content } = req.body;
            const post = await Post.findOne({ where });
            if (!post) return res.status(404).send('Post tidak ditemukan atau bukan milik Anda.');
            await post.update({ content });
            await syncPostHashtags(post);
            res.redirect(isAdmin ? '/admin/feeds' : '/student/feeds');
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const base = req.session.role === 'admin' ? '/admin' : '/student';
                return res.redirect(`${base}/feeds/${req.params.id}/edit?error=${encodeURIComponent(validationMessages(error))}`);
            }
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async taskCompleted(req, res) {
        try {
            const { id } = req.params;

            const task = await Task.findOne({
                where: { id, userId: req.session.userId }
            });

            if (!task) {
                return res.status(404).send('Task tidak ditemukan atau bukan milik Anda.');
            }

            await Task.update(
                { isCompleted: !task.isCompleted },
                { where: { id, userId: req.session.userId } }
            );

            res.redirect('/student');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
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
            console.error(error);
            res.status(500).send('Internal Server Error');
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
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async profile(req, res) {
        try {
            const user = await User.findByPk(req.session.userId, {
                include: [{ model: Profile }]
            });
            res.render('profile', { user });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = Controller
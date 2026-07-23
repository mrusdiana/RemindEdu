const { User, Task } = require('../models')

class Controller {

    static async homePage(req, res){
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
            const tasks = await Task.findAll({ where: { userId: req.session.userId } });
            res.render('dashboard', { tasks, role: 'student' });
        } catch (error) {
            res.send(error);
        }
    }
    
    static async adminDashboard(req, res) {
        try {
            const tasks = await Task.findAll({ include: 'User' }); // semua task, semua user
            res.render('dashboard', { tasks, role: 'admin' });
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
            const { name, email, password } = req.body;
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
            res.render('login', { error: req.query.error || null }); // GET — tampilin form
        } catch (error) {
            res.send(error);
        }
    }
    
    static async postLogin(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
    
            if (!user || !user.comparePassword(password)) {
                return res.redirect('/login?error=Email atau password salah');
            }
    
            req.session.userId = user.id;
            req.session.role = user.role;
    
            if (user.role === 'admin') {
                return res.redirect('/admin');
            }
            res.redirect('/student');
        } catch (error) {
            res.send(error);
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

    static async login(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async dashboard(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async socialFeed(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async getAddTask(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async postAddTask(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async getEditTask(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async postEditTask(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async getAddFeed(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async postAddFeed(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async getEditFeed(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async postEditFeed(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async taskCompleted(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async deleteFeed(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async deleteTask(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async profile(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = Controller
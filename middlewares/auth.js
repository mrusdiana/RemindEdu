// Cek apakah user sudah login
function isLoggedIn(req, res, next) {
    if (!req.session.userId) {
      return res.redirect('/login');
    }
    next();
  }
  
  // Khusus halaman admin
  function isAdmin(req, res, next) {
    if (req.session.role !== 'admin') {
      return res.status(403).send('Akses ditolak — khusus admin');
    }
    next();
  }
  
  // Khusus halaman student
  function isStudent(req, res, next) {
    if (req.session.role !== 'student') {
      return res.status(403).send('Akses ditolak — khusus student');
    }
    next();
  }
  
  module.exports = { isLoggedIn, isAdmin, isStudent };
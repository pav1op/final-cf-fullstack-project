const jwt = require('jsonwebtoken');

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        (req, res, next) => {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
            }

            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    return res.status(403).json({ message: 'Access Denied: Invalid Token!' });
                }

                if (roles.length && !roles.includes(user.role)) {
                    return res.status(401).json({ message: 'Access Denied: Insufficient Privileges!' });
                }

                req.user = user;
                next();
            });
        }
    ];
}

module.exports = authorize;
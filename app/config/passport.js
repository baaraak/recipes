import passport from 'passport';
import User from '../models/user';
import FacebookTokenStrategy from 'passport-facebook-token';

module.exports = function () {

    passport.use(new FacebookTokenStrategy({
        clientID: '2232059320356745',
        clientSecret: 'bff8b1d32e94bc2e117191650cc0e28a'
    },
        function (accessToken, refreshToken, profile, done) {
            User.upsertFbUser(accessToken, refreshToken, profile, function (err, user) {
                return done(err, user);
            });
        }));
};
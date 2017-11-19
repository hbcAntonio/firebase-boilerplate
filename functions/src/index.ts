import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as handlebars from 'express-handlebars';
import * as cookieParser from 'cookie-parser';
import { credentials, constants } from './config';

admin.initializeApp({
    credential: admin.credential.cert(credentials as any),
    databaseURL: "https://fir-boilerplate-9d8cc.firebaseio.com"
});

const app = express();

app.engine('hbs', handlebars({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(cookieParser());

async function auth(req : express.Request, res : express.Response, next : express.NextFunction) {
    const token : string = req.cookies['__f4wtoken_tsa'];
    try {
        const decodedToken : any = await admin.auth().verifyIdToken(token);
        const ALLOWED = constants.HDALLOWED;
        const hd = decodedToken.email.split('@')[1];
        const pass = ALLOWED.find(el => el === hd);

        // Check if decodedToken belongs to hosted domain
        if (!pass) {
            // Delete user and deny access
            console.warn('User hosted domain is not authorized!');
            await admin.auth().deleteUser(decodedToken.uid);
            res.status(403);
            res.end('unauthorized');
            return;
        }
        next();

    } catch (err) {
        console.error(err.message);
        res.status(403);
        res.redirect('/login');
    }
};

app.get('/', auth, (req, res) => {
    const data = { mcdonalds: 1 };
    res.render('index', { data });
});

app.get('/login', (req, res) => {
    res.render('login');
});

exports.app = functions.https.onRequest(app);
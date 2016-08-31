var user = require('../models/User');
var config = require('../../config');
var secretKey = config.secretKey;
var jsonWebToken = require('jsonwebtoken');

function createToken(user){
    var token  = jsonWebToken.sign({
        _id: user._id,
        name : user.name,
        username : user.username
    } , secretKey);
    return token;
}

module.exports = function (app, express) {
    var api = express.Router();
    api.post('/signup', function (req, res) {
        var User = new user({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });
        User.save(function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({message: 'user has been created!!'});
        });
    });


    api.get('/users', function (req, res) {
        user.find({}, function (err, users) {
            if (err) {
                res.send(err);
                return;
            }
            else {
                res.json(users);
            }
        });
    });


    api.post('/login', function (req, resp) {
        user.findOne({
            username: req.body.username
        }).select('password').exec(function (err, user) {
            if (err) {
                console.log(err);
                throw err;
            }
            if (!user) res.send({message: "User doesn't exist"});
            else if (user) {
                var validPassword = user.comparePassword(req.body.password);
                console.log("valid password == " + validPassword);
                if (!validPassword) {
                    res.send({message: "Invalid Password"});
                    console.log("valid password == " + validPassword);
                }
                else {

                 var token = createToken(user);
                    console.log("token got created " + token)

                    console.log("i am at else")
                    resp.json({
                        success : true,
                        message: "Successfully login",
                        token : token
                    });
                }
            }
        });
    });


    //custom middleware for checking users like a police officer after user loginin
    app.use(function(req , res , next){
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        // check if token exists
        if(token){
            jsonWebToken.verify(token , secretKey , function(err , decoded){

            });
        }
    });

    return api;
}
const bcrypt = require("bcrypt")
const UserModel = require("../model/user-model")

//add [ POST ]
module.exports.addUser = function(req, res) {

    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let email = req.body.email
    let password = req.body.password
        //encrypt

    let encPassword = bcrypt.hashSync(password, 10)

    let gender = req.body.gender
    let contactNumber = req.body.contactNumber
    let dob = req.body.dob
    let role = req.body.role
    let isSubscribed = req.body.isSubscribed


    let user = new UserModel({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: encPassword,
        gender: gender,
        contactNumber: contactNumber,
        dob: dob,
        role: role,
        isSubscribed: isSubscribed
    })

    user.save(function(err, data) {
        if (err) {
            res.json({ msg: "SMW", data: err, status: -1 }) //-1 [302 404 500]
        } else {
            res.json({ msg: "signup done", data: data, status: 200 }) //http status code
        }
    })
}

//list
module.exports.getAllusers = function(req, res) {
    UserModel.find().populate("role").exec(function(err, data) {
        if (err) {
            res.json({ msg: "SMW", data: err, status: -1 }) //-1 [302 404 500]
        } else {
            res.json({ msg: "users ret...", data: data, status: 200 }) //http status code
        }
    })
}

//delete
module.exports.deleteUser = function(req, res) {
    //params userid
    let userId = req.params.userId // postman -> userid

    UserModel.deleteOne({ _id: userId }, function(err, data) {
        if (err) {
            res.json({ msg: "SMW", data: err, status: -1 })

        } else {
            res.json({ msg: "user removed...", data: data, status: 200 })
        }
    })
}

//update

module.exports.updateUser = function(req, res) {
    let userId = req.body.userId
    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let email = req.body.email
    let password = req.body.password
    let gender = req.body.gender
    let contactNumber = req.body.contactNumber
    let dob = req.body.dob

    UserModel.updateOne({ _id: userId }, { firstname: firstname, lastname: lastname, email: email, password: password, gender: gender, contactNumber: contactNumber, dob: dob }, function(err, data) {
        if (err) {
            res.json({ msg: "Something went wrong!!!", status: -1, data: err })
        } else {
            res.json({ msg: "updated...", status: 200, data: data })
        }
    })
}


//login

module.exports.login = function(req, res) {

    let param_email = req.body.email
    let param_password = req.body.password

    let isCorrect = false;


    UserModel.findOne({ email: param_email }, function(err, data) {
        if (data) {
            let ans = bcrypt.compareSync(param_password, data.password)
            if (ans == true) {
                isCorrect = true
            }
        }

        if (isCorrect == false) {
            res.json({ msg: "Invalid Credentials...", data: req.body, status: -1 })
        } else {
            res.json({ msg: "Login.....", data: data, status: 200 }) //http status code
        }
    })
}
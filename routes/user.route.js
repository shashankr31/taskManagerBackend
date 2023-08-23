const User = require('../models/user.model');
const router = require('express').Router();

router.route('/getInitialData').get((req, res) => {
    console.log("ssss", req.query);
    User.findById(req.query.userId)
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const password = req.body.password;

    const newUser = new User({
        userName,
        userEmail,
        password
    });

    newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => {
            console.log("-----", err);
            res.status(400).json('Error: ' + err)
        });
});



router.route('/login').post((req, res) => {
    const userEmail = req.body.userEmail;
    const password = req.body.password;

    User.findOne({ userEmail: userEmail })
        .then((user) => {
            if (user.password === req.body.password) {
                res.json({
                    message: "User login successful",
                    status: true,
                    userData: {
                        _id: user._id,
                        userName: user.userName,
                        userEmail: user.userEmail,
                        tasks: user.tasks,
                    }
                })
            }
            else {
                res.json({
                    message: "Please check your email/password",
                    status: false
                })
            }
        })
        .catch((err) => {
            res.json({
                message: "No email found",
                status: false
            })
        })
});

router.route('/addTask').post((req, res) => {
    User.findOneAndUpdate(
        { _id: req.body.userId },
        {
            $push: {
                tasks: {
                    name: req.body.task,
                    status: "pending"
                }
            }
        },
        { new: true } 
    )
        .then((user) => {
            const addedTask = user.tasks[user.tasks.length - 1]; 
            res.json({
                task: addedTask,
                message: "Task added successfully",
            });
        })
        .catch((err) => {
            res.status(400).json({
                message: "Couldn't add task",
                error: err,
            });
        });
});



router.route('/updateTask').post((req, res) => {
    const { userId, taskId, task, status } = req.body;

    User.findOneAndUpdate(
        { _id: userId, 'tasks._id': taskId }, 
        { $set: { 'tasks.$.name': task, 'tasks.$.status': status } },
        { new: true }
    )
        .then((user) => {
            const updatedTask = user.tasks.find(t => t._id.toString() === taskId);
            if (updatedTask) {
                res.json({
                    task: updatedTask,
                    message: "Task updated successfully",
                });
            } else {
                res.status(400).json({
                    message: "Task not found",
                });
            }
        })
        .catch((err) => {
            res.status(400).json({
                message: "Couldn't update task",
                error: err,
            });
        });
});

router.post('/deleteTask', (req, res) => {
    const { userId, taskId } = req.body;

    User.findByIdAndUpdate(
        userId,
        {
            $pull: { tasks: { _id: taskId } },
        },
        // { new: true } 
    )
        .then((user) => {
            const deletedTask = user.tasks.find(task => task._id.toString() === taskId);
            if (deletedTask) {
                res.json({
                    task: deletedTask,
                    message: "Task deleted successfully",
                });
            } else {
                res.status(400).json({
                    message: "Task not found",
                });
            }
        })
        .catch((err) => {
            res.status(400).json({
                message: "Couldn't delete task",
                error: err,
            });
        });
});

module.exports = router;
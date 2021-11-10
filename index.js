const http = require('http')
const path = require('path')
const express = require('express')
const {dirname} = require('path')
const hbs = require('hbs');
const { response } = require('express');
const app = express()
const dbConnection = require('./connection/db');
const session = require('express-session');
const { query } = require('./connection/db');

app.use(express.json())
app.use('/template', express.static(path.join(__dirname, 'template')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:false}));
app.set('view engine', 'hbs')

app.use(
    session(
        {
            cookie:{
                // 1000 milidetik * 60 detik * 60 menit
                maxAge: 1000 * 60 * 60 * 2,
                // keamanan
                secure: false,
                httpOnly: true
            },
            // menyimpan session
            store: new session.MemoryStore(),
            saveUninitialized: true,
            resave: false,
            secret: 'secretkey'
        }
    )
);

// setup flash message midleware
app.use(function(request, response, next){
    response.locals.user = request.session.user
    response.locals.message = request.session.message
    delete request.session.message
    next()
});

let isLogin = false;

hbs.registerPartials(__dirname + '/views/partials');

app.get('/', function(request, response){
    const query = `SELECT * FROM collections_tb ORDER BY id DESC`

    dbConnection.getConnection(function(err, conn){
        if(err) throw err
        

        conn.query(query, function(err, results) {
            console.log(query)
            if(err) throw err
            
            const collections = []

            for(let result of results) {
                collections.push({
                    id : result.id,
                    name : result.name
                })
            }
            console.log(collections)
            response.render('index', {
                title : 'My Collection',
                isLogin: request.session.isLogin,
                collections
            })
        })
        conn.release();
    }) 
});

app.get('/register', function(request, response){
    response.render('register', {
        title : 'Register',
        isLogin
    })
});

app.post('/register', function(request, response){
    const {email, username,  password} = request.body

    if(email == '' || username == '' || password == ''){
        request.session.message = {
            type : 'danger',
            message: 'Please insert all data'
        }
        return response.redirect('/register')
    }

    const query = `INSERT INTO users_tb (email, username, password) VALUES ("${email}", "${username}", ${password})`
    
    dbConnection.getConnection(function(err, conn){
        if(err) throw err

        conn.query(query, function(err, results) {
            if(err) throw err
            request.session.message = {
                type : 'success',
                message: 'Your has register'
            }
            response.redirect('/register')
        })
        conn.release();
    })
});

app.get('/login', function(request, response){
    response.render('login', {
        title : 'Login'
    })
});

app.post('/login', function(request, response, next){
    const {username, password} = request.body

    if( username == '' || password == ''){
        request.session.message = {
            type : 'danger',
            message: 'Please insert all data'
        }
        return response.redirect('/login')
    }

    const query = `SELECT *, MD5(password) AS password FROM users_tb WHERE username="${username}" AND password=${password}`
    
    dbConnection.getConnection(function(err, conn){
        if(err) throw err

        conn.query(query, function(err, results) {
            if(err) throw err
            
            if(results.length == 0) {
                request.session.message = {
                    type : 'danger',
                    message: 'Please insert all data'
                }
                response.redirect('/login')
            }else{
                request.session.message = {
                    type : 'success',
                    message: 'Your has Login'
                }
                request.session.isLogin = true
                isLogin = true

                // get from users
                request.session.user ={
                    id: results[0].id,
                    email: results[0].email,
                    username: results[0].username,
                    password: results[0].password
                }
                
            }
            response.redirect('/')
        })
        conn.release();
    })

});

app.get('/logout', function (request, response) {
    request.session.destroy()
    response.redirect('/')
});

app.get('/addCollection', function(request, response){
    response.render('addCollection', {
        title : 'Add Collection'
    })
});

app.post('/addCollection', function(request, response){
    const {name} = request.body
    const userId = request.session.user.id

    if(name == ''){
        request.session.message = {
            type : 'danger',
            message: 'Please insert all data'
        }
        return response.redirect('/addCollection')
    }

    const query = `INSERT INTO collections_tb (name, user_id) VALUES ("${name}", "${userId}")`
    
    dbConnection.getConnection(function(err, conn){
        if(err) throw err

        conn.query(query, function(err, results) {
            if(err) throw err
            request.session.message = {
                type : 'success',
                message: 'Your has success submit'
            }
            console.log(query)
            response.redirect('/addCollection')
        })
        conn.release();
    })
});

app.get('/editCollection/:id', function(request, response){
    const {id} = request.params;
    
    const query = `SELECT * FROM collections_tb WHERE id=${id}`

    dbConnection.getConnection(function(err, conn){
        if(err) throw err

        conn.query(query, function(err, results) {

            if(err) throw err
            
            const collection = {
                id : results[0].id,
                name : results[0].name,
            }
            
            response.render('editCollection', {
                title : 'Edit Task',
                isLogin : request.session.isLogin,
                collection
            })
        })
        conn.release();
    })
});

app.post('/editCollection/:id', function(request, response){
    const {id} = request.params
    const {name} = request.body

    if(name == '') {
        request.session.message = {
            type : 'danger',
            message: 'Please input all data!'
        }
        return response.redirect('/editCollection/:id')
    }

    const query = `UPDATE collections_tb SET name="${name}" WHERE id=${id}`

    dbConnection.getConnection(function(err, conn){
        if(err) throw err

        conn.query(query, (err, results) => {

            if(err) throw err

            request.session.message = {
                type : 'success',
                message: 'Edit Movie has been submit!'
            }
            response.redirect(`/`)
        });
        conn.release();
    })
});

app.get('/deleteCollection/:id', function (request, response) {
    const id = request.params.id

    const query = `DELETE FROM collections_tb WHERE id=${id}`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;

        conn.query(query, function (err, results) {
        if (err) throw err

        response.redirect('/')
        })
    })
})

app.get('/task/:id', function(request, response){
    const {id} = request.params;

    const query = `SELECT task_tb.id, task_tb.name AS task, task_tb.collections_id, collections_tb.name AS collection FROM task_tb INNER JOIN collections_tb ON task_tb.collections_id=collections_tb.id  
    WHERE task_tb.collections_id=${id}`

    dbConnection.getConnection(function(err, conn){
        if(err) throw err
        

        conn.query(query, function(err, results) {
            console.log(query)
            if(err) throw err

            const tasks = []

            for(let result of results) {
                tasks.push({
                    id : result.id,
                    task : result.task,
                    collection : result.collection
                })
            }
            console.log(tasks)
            response.render('task', {
                title: 'Task',
                isLogin: request.session.isLogin,
                tasks,
                id
            })
        })
        conn.release();
    }) 
});

app.post('/addTask/:id', function(request, response){
    const {name} = request.body
    const collectionId = request.params.id
    console.log(collectionId)

    if(name == ''){
        request.session.message = {
            type : 'danger',
            message: 'Please insert all data'
        }
        return response.redirect('/addCollection')
    }

    const query = `INSERT INTO task_tb (name, collections_id) VALUES ("${name}", "${collectionId}")`
    
    dbConnection.getConnection(function(err, conn){
        if(err) throw err

        conn.query(query, function(err, results) {
            console.log(query)
            if(err) throw err
            request.session.message = {
                type : 'success',
                message: 'Your has success submit'
            }
            response.redirect(`/task/${collectionId}`)
        })
        conn.release();
    })
});

app.get('/deleteTask/:id', function (request, response) {
    const id = request.params.id

    const query = `DELETE FROM task_tb WHERE id=${id}`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;

        conn.query(query, function (err, results) {
        if (err) throw err

        response.redirect('/')
        })
    })
})


const port = 3000 
const server = http.createServer(app)
server.listen(port)
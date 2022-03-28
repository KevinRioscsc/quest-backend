const express = require('express');
const app = express();
const knex = require('knex')
const cors = require('cors');

const db = knex({
    client: 'pg',
    connection:{
    connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: false
        }
    }
});
/*
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'Kevthebest12@',
      database : 'trello-clone',
      idleTimeoutMillis: 0,
      connectionTimeoutMillis: 0,
    }
  });*/

  
console.log('hi')



app.use(express.json());
app.use(cors());

app.post('/createList', (req, res) => {
    const {pid, title} = req.body;

    db('list').insert({
        pid:pid,
        title:title,
    }).returning('lid').then(resp => res.json(resp[0]))
    
})
app.post('/createProject', (req, res) => {
    const {uid, title, url} = req.body;

    db('projects').insert({
        uid:uid,
        title:title,
        url:url
    }).returning('pid').then(resp => res.json(resp[0]))
    
})
app.post('/createCard', (req, res) => {
    const {lid, titleCard} = req.body;

    db('card').insert({
        lid:lid,
        titleCard:titleCard,
    }).returning('cid').then(resp => res.json(resp[0]))
    
})

app.post('/getProjects', (req, res) => {
    const {uid} = req.body
    db('projects').where('uid', '=', uid).then(response => res.json(response))

})
app.post('/getList', (req, res) => {
    const {pid} = req.body;

    db('projects')
    .join('list', 'list.pid',`projects.pid`)
    .join('card', 'card.lid', 'list.lid')
    .select('list.lid','list.title','card.cid','card.title')
    .where('project.pid', pid)
    .orderBy('list.lid').then(response => res.json(response))
    
    //db('list').where('pid', '=', pid).then(response => res.json(response))

})
app.post('/getCard', (req, res) => {
    const {lid} = req.body
    db('card').where('lid', '=', lid).then(response => res.json(response))

})
app.post('/delCard', (req, res) => {
    const {cid} = req.body
    db('card')
  .where({ cid: cid })
  .del().then(resp => res.json('success'))

})
app.post('/getProject', (req, res) => {
    const {pid} = req.body
    db('projects').where('pid', '=', pid).then(response => res.json(response))

})
app.get('/', (req, res) =>{res.send('it is working!')})



app.listen(process.env.PORT || 3001, ()=>{
    console.log("We are listening")
});
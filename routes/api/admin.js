const express = require('express')
const knex = require('../../knex')
const boom = require('boom')
const bcrypt = require('bcrypt')
const {
  camelizeKeys,
  decamelizeKeys
} = require('humps')
const router = express.Router()

// get current admins
router.get('/admins', (req, res, next) => {
  knex('users')
    .orderBy('id', 'ASC')
    .where('is_admin', true)
    .then((admins) => {
      res.send(camelizeKeys(admins))
    })
    .catch((err) => {
      next(err)
    })
})

// delete admin
router.delete('/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id)

  if (Number.isNaN(id)) {
    return next()
  }
  let admin

  knex('users')
    .where('id', id)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Not Found')
      }
      student = row
      
      return knex('users')
        .del()
        .where('id', id)
    })
    .then(() => {
      delete admin.id
      res.send(admin)
    })
    .catch((err) => {
      next(err)
    })
})

// post a new admin to users table and refresh current admin table
router.post('/', (req, res, next) => {
  const { username, password } = req.body

  if (!username || !username.trim()) {
    return next(boom.create(400, 'Email must not be blank'))
  }

  if (!password || password.length < 4) {
    return next(boom.create(400, 'Password must be at least 4 characters long'))
  }

  knex('users')
    .where('username', username)
    .first()
    .then((row) => {
      if (row) {
        return next(boom.create(404, 'Admin already exist!'))
      }
      return bcrypt.hash(password, 10)
    })
    .then((hash) => {
      return knex('users')
        .insert({
          username,
          hashed_password: hash,
          is_admin: true
        }, '*')
    })
    .then((user) => {
      res.send(camelizeKeys(user[0]))
    })
    .catch((err) => next(err))
})

module.exports = router

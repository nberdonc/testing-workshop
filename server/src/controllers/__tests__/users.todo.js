import { initDb } from 'til-server-test-utils'
import * usersController from '../users'
import db from '../../utils/db'
import { json } from 'body-parser'

//The function setup will initialize our request, that handles all the necessary cases that are common for all our tests.
function setup() {
  const req = {
    body: {},
  }
  //this object is using express
  Object.assign(res, {
    status: jest.fn(
      function status() {
        return this
      }.bind(res),
    ),
    json: jest.fn(
      function json() {
        return this
      }.bind(res),
    ),
    send: jest.fn(
      function sent() {
        return this
      }.bind(res),
    ),
  })
  return { req, res }
}

beforeEach(() => initDb())

test('getUsers returns all users in the database', async () => {
  const { req, res } = setup()

  await usersController.getUsers(req, res)

  expect(res.json).toHaveBeenCalledTimes(1)
  const firstCall = res.json.mock.calls[0]
  const firstArg = firstCall[0]
  const { users } = firstArg
  expect(users.length).toBeGreaterThan(0)
  const actualUsers = await db.getUsers()
  expect(users).toEqual(actualUsers.map(safeUser))
})

test('getUser returns the specific user', async () => {
  const testUser = await db.insertUser(generate.userData())
  const { res, req } = setup()
  req.params = { id: testUser.id }

  await usersController.getUser(req, res)

  expect(res.json).toHaveBeenCalledTimes(1)
  const firstCall = res.json.mock.calls[0]
  const firstArg = firstCall[0]
  const { user } = firstArg
  expect(user).toEqual(safeUser(testUser))
  const userFromDb = await db.getUser(user.id)
  expect(userFromDb).toEqual(testUser)
})

test('updateUser updates the user with the given changes', async () => {
  const testUser = await db.insertUser(generate.userData())
  const { req, res } = setup()
  const username = generate.username()
  req.user = { id: testUser.id }
  req.params = { id: testUser.id }
  req.body = { username }
  const updatedUser = { ...testUser, username }

  await usersController.updateUser(req, res)

  expect(res.json).toHaveBeenCalledTimes(1)
  const firstCall = res.json.mock.calls[0]
  const firstArg = firstCall[0]
  const { user } = firstArg
  expect(user).toEqual(safeUser(updatedUser))
  const userFromDb = await db.getUser(user.id)
  expect(userFromDb).toEqual(updatedUser)
})

test('deleteUser will 403 if not requestes by the user', async () => {
  const { req, res } = setup()
  const testUser = await db.insertUser(generate.userData())
  req.params = { id: testUser.id }
  req.user = { id: generate.id() }
  await usersController.deleteUser(req, res)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(403)
  expect(res.send).toHaveBeenCalledTimes(1)
})

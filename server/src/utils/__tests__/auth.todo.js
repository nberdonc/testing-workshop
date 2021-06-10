import {isPasswordAllowed, userToJSON} from '../auth'

// //The below coding would be a simple way to test the expected
// test('isPasswordAllowed only allows some passwords', () => {
//   expect(isPasswordAllowed('')).toBe(false)
//   expect(isPasswordAllowed('fffffffffff')).toBe(false)
//   expect(isPasswordAllowed('888888888888')).toBe(false)
//   expect(isPasswordAllowed('sjkhuehf.9742h')).toBe(true)
// })

// //Let's refractor the above code into the below code

//test object factory ( to have multiple expectancies in one variable)
describe('isPasswordAllowed', () => {
  const allowedPasswords = ['sjkhuehf.9742h']
  const disallowedPasswords = ['', 'fffffffffff', '888888888888']

  allowedPasswords.forEach(pwd => {
    it(`"${pwd}", should be allowed`, () => {
      expect(isPasswordAllowed(pwd)).toBe(true)
    })
  })

  disallowedPasswords.forEach(pwd => {
    it(`"${pwd}", should NOT be allowed`, () => {
      expect(isPasswordAllowed(pwd)).toBe(false)
    })
  })
})

test('userToJSON excludes secure properties', () => {
  const safeUser = {
    id: 'some-id',
    username: 'sarah',
  }
  // Here you'll need to create a test user object
  // pass that to the userToJSON function
  // and then assert that the test user object
  // doesn't have any of the properties it's not
  // supposed to.
  // Here's an example of a user object:
  const user = {
    ...safeUser,
    // ↑ above are properties which should
    // be present in the returned object

    // ↓ below are properties which shouldn't
    // be present in the returned object
    exp: new Date(),
    iat: new Date(),
    hash: 'some really long string',
    salt: 'some shorter string',
  }
  const jsonUser = userToJSON(user)
  expect(jsonUser).toEqual(safeUser)
})

//////// Elaboration & Feedback /////////
// When you've finished with the exercises:
// 1. Copy the URL below into your browser and fill out the form
// 2. remove the `.skip` from the test below
// 3. Change submitted from `false` to `true`
// 4. And you're all done!
/*
http://ws.kcd.im/?ws=Testing&e=auth%20util&em=
*/
test.skip('I submitted my elaboration and feedback', () => {
  const submitted = false // change this when you've submitted!
  expect(submitted).toBe(true)
})
////////////////////////////////

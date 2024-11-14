import chai from 'chai'
import chaiHttp from 'chai-http'
import { login, logout, registerUser} from '../../src/controllers/booking.controller.js'
import { User } from '../../src/models/user.model.js'

chai.use(chaiHttp)
const {expect} = chai;

describe('User Controller Tests', () => {
  // sample Data 
  it("should create a user with the required fields", async() => {
    const userData = {
      username:"testuser",
      email: "testuser@example.com",
      firstName: "Test",
      lastName: "User",
      password: "password123",
      role: "homeowner"
    }

    const user = await User.create(userData);
    
    expect(user).to.have.property("username","testuser");
    expect(user).to.have.property("email","testuser@example.com");
    expect(user).to.have.property("firstName","test");
    expect(user).to.have.property("lastName","User");
    expect(user).to.have.property("role","homeowner");
    expect(user).to.have.property("username","testuser");

  })
})
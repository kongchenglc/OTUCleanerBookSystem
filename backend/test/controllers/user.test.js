import * as chai from 'chai'
import chaiHttp from 'chai-http'
import mongoose from 'mongoose'
import { loginUser, logoutUser, registerUser} from '../../src/controllers/user.controller.js'
import { User } from '../../src/models/user.model.js'

chai.use(chaiHttp)
const {expect} = chai;

// describe function used to group and organise related test cases 
//  so easy to organize the tests

// connect to the test database before running tests
before((done)=>{
  mongoose.connect('mongodb+srv://karan:sxGEi7flOaBFwtPO@cluster0.71axo.mongodb.net/OTUCleanerBookSystemDemo'  ,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database connected successfully.");
    done();
  })
  .catch((err) => {
      console.error("Database connection error:", err);
      done(err);
});
  // mongoose.connection.once('open', () => {
  //   console.log("under connection")
  //   done()
  // })
})

// disconnect from the database after all test
console.log("working disconnect")
after((done) => {
  mongoose.connection.close(()=> done());
})

describe('User Controller Tests', () => {
  // sample Data 
  it("should create a user with the required fields", async() => {
    const userData = {
      username:"testuser1",
      email: "testuser1@example.com",
      firstName: "Test1",
      lastName: "User1",
      password: "password1234",
      role: "homeowner"
    }

    const user = await User.create(userData);
    
    expect(user).to.have.property("username","testuser1");
    expect(user).to.have.property("email","testuser1@example.com");
    expect(user).to.have.property("firstName","Test1");
    expect(user).to.have.property("lastName","User1");
    expect(user).to.have.property("role","homeowner");
    expect(user).to.have.property("username","testuser");

  })
})
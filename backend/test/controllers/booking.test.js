import * as chai from 'chai'
import chaiHttp from 'chai-http'
import { createBooking, getLandlordBookings, getBookingById, updateBookingById } from '../../src/controllers/booking.controller.js'
import mongoose from 'mongoose'
import { Booking } from '../../src/models/booking.model.js'

chai.use(chaiHttp);
const { expect } = chai;
// describe function used to group and organise related test cases 
//  so easy to organize the tests

// connect to the test database before running tests
before((done)=>{
  mongoose.connect('mongodb+srv://karan:sxGEi7flOaBFwtPO@cluster0.71axo.mongodb.net/OTUCleanerBookSystemDemo'  ,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  
  );
  mongoose.connection.once('open', () => {
    console.log("under connection")
    done()
  })
})

// disconnect from the database after all test
console.log("working disconnect")
after((done) => {
  mongoose.connection.close(()=> done());
})

describe("Booking Controller Tests", () => {
  // Sample Data Mocks
  const mockService = {
    serviceId : '64fe76f536f1a6473cc117a1',
    name: "cleaing",
    basePrice: 100,
    bookingDate: new Date(),
    totalPrice: 100
  };

  describe("POST /createBooking", () => {
    it("should create a new booking", async() => {
      const req = {
        body: {
          cleanerId: "64fe76f536f1a6473cc117b2",
          service: mockService,
          specialInstructions: "Handle with care"
        },
        user: { _id: "64fe76f536f1a6473cc117b1" }
        // Mock landlord ID
      }; 

      const res = {
        status: (code) => ({ json: (data) => data }),
      };

      const response = await createBooking(req,res);
      console.log({response});
      // expect(response.success).to.equal(true);
      // expect(response.failure).to.equal(true);
      // expect(response.statusCode).to.equal(201);
      expect(response.booking).to.have.property('homeownerId');
    })
  })

  describe("GET /getLandlordBookings", ()=>{
    it("should retrieve all bookings from the landlord", async() => {
      const req = {
        // donot need to add body as we are not taking parameters in this
        // body: {}
      }
      const res = {
        status: (code) => ({ json: (data) => data }),
      };

      const response = await getLandlordBookings(req,res);
      expect(response.success).to.equal(true);
      expect(response.bookings).to.be.an('array');
    })
  })

  describe("GET /getLandlordBookingByID", ()=>{
    it("should retrieve bookings from the particular ID", async()=> {
      const req = {
        params: 
        {
          bookingId: "6730f25afe56a1647dbf4a1b"
        }
      }
      const res = {
        status: (code) => ({json: (data) => data})
      };

      const response = await getBookingById(req, res);
      expect(response.success).to.equal(true);
      expect(response.bookings).to.have.property('homeownerId')
    })
  })

  describe("PUT /updateBookingById", () => {
    it("should update the booking with new data", async() => {
      const req = {
        params: { bookingId: "" },
        user: {_id: ""},
        body: {
          status:"confirmed",
          specialInstructions: "Use eco-friendly products"
        }
      };

      const res = {
        status: (code) => ({json: (data)=> data})
        
      }

      const response = await updateBookingById(req, res);
      expect(response.success).to.equal(true);
      expect(response.booking.status).to.equal("Confirmed");
    })
  })
})

export default chai
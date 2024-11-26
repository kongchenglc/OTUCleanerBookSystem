import * as chai from 'chai'
import chaiHttp from 'chai-http'
import { Service } from '../../src/models/services.model.js'

chai.use(chaiHttp);

const {expect} = chai

describe('Services Controller Tests', () => {
  const serviceData = {
    name: "Deep Cleaning",
    description: "Comprehensive cleaning of all rooms",
    basePrice: 100,
    duration: "3 hours"
  };

  describe("POST /createService", () => {
    it("should create a new service", async() => {
      const req = {
        body: {

        }
      }
    })
  })
})

import chai from 'chai';
import chaiHttp from 'chai-http';
import server from './server.js'
chai.should();

chai.use(chaiHttp);

describe("GET /get/conversation", () => {
    it("It should GET a conversation", (done) => {
        chai.request(server)
            .get("/get/conversation")
            .end((err, response) => {
                response.should.have.status(200);
            done();
            })
    })  
    
})
const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../app.js");
require('dotenv').config();

chai.should();
chai.use(chaiHttp);

describe.skip("/POST ping", () => {
  it("it should return 400", done => {
    chai
      .request(app)
      .post(`/ping/`)
      .send({ teamName: "Shums" })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("response")
          .eql("Shums is not part of the team. Modify your .env");
        done();
      });
  });
});

describe("/api/messages authorized sender", () => {
  it("it should should prevent users from joining others' conversations", done => {
    chai
      .request(app)
      .post('/auth/login')
      .send({
        username: "ashanti",
        password: "123456"
      })
      .end((err, res) => {
        res.body.should.have.property('token');
        var token = res.body.token;
        chai
          .request(app)
          .post('/api/messages')
          .set('x-access-token', token)
          .send({
            "user": {
              "id": 5
            },
            "recipientId": 1,
            "text": "hacked",
            "conversationId": 1,
            "sender": null
          })
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have
              .property("error")
              .eql("Forbidden conversation");
            done();
          });
      });
  });
});

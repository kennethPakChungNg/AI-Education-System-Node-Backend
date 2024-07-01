import dotenv from 'dotenv';
import Startup from '../../../app'
import request from 'supertest';


before(function() {
    // Load environment variables from .env file
    dotenv.config();

});


describe('User Info', () => {
    let serverObj = new Startup();
    beforeEach((done) => {

        done();      
    });
    describe('/POST storeUserBackground', async () => {
        it('it should save user info', (done) => {
            const payload = { 
                WalletAddress: "0xqwefegewg"
            }
            request(serverObj.app)
                .post('/userInfo/storeUserBackground')
                .send(payload)
                .expect(200) 
                .end((err, res) => {
                    //res.body.should.be.a('array');
                    //res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
});
var should = require('should');
var server = require('../server');

describe('Creating a new User',function(){
  var user = '';

  it('should have a username',function(){
    console.log(JSON.stringify(server,null,2));
    //options({"thing":1});
    user.should.be.exactly('');
  });
});
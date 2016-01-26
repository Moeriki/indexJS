// modules

var index = require('../index');
var expect = require('chai').expect;

// tests

describe('indexJS', function () {

    before(function () {
        this.index = index('./test/index-test-structure');
    });

    it('should require all js files in a directory', function () {
        expect(this.index).to.have.property('file-1').to.equal('file-1');
        expect(this.index).to.have.property('file-2').to.equal('file-2');
        expect(this.index).to.not.have.property('file-3');
    });

    it('should require nested directories', function () {
        expect(this.index).to.have.deep.property('nested-1.file-4').to.equal('file-4')
    });

    it('should use the index file of nested directories', function () {
        expect(this.index).to.have.deep.property('nested-2.file-5').to.equal('file-5');
        expect(this.index).to.have.deep.property('nested-2.customerIndex').to.be.true;
    });

});

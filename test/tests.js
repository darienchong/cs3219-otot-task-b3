// To be tested
let resthub = require('../index');
let contact = require('../contactModel');

// Dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');

// Setup
chai.use(chaiHttp);
let should = chai.should();

let model = {
	name: "John Doe",
	email: "johndoe@email.com",
	gender: "Male",
	phone: "91234567"
};

let updatedModel = {
	name: "Jane Doe",
	email: "janedoe@email.com",
	gender: "Female",
	phone: "92345678"
};

// Tests
describe('API endpoint testing', function() {
	// Clear the database first before testing
	before(function() {
		contact.deleteMany({}, (err) => {});
	});
	
	// We'll use these to store created and updated contacts to check against later.
	let createdContact = null;
	let updatedContact = null;
	
	describe('List all contacts', function() {
		it('All contacts should be listed (empty)', function(callWhenDone) {
			chai.request(resthub)
				.get('/api/contacts')
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.status.should.be.eql('success');
					res.body.message.should.be.eql('Contacts retrieved successfully');
					res.body.should.have.property('data');
					res.body.data.length.should.be.eql(0);
					callWhenDone();
				});
		});
	});
	
	describe('Create a new contact', function() {
		it('A new contact should be created', function(callWhenDone) {
			chai.request(resthub)
				.post('/api/contacts')
				.send(model)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.message.should.be.eql('New contact created!');
					res.body.should.have.property('data');
					res.body.data.name.should.be.eql(model.name);
					res.body.data.email.should.be.eql(model.email);
					res.body.data.gender.should.be.eql(model.gender);
					res.body.data.phone.should.be.eql(model.phone);
					createdContact = res.body.data;
					callWhenDone();
				});
		});
	});
	
	describe('Check that the new contact is reflected in the database', function() {
		it('The same new contact should be reflected in the database', function(callWhenDone) {
			chai.request(resthub)
				.get('/api/contacts')
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.status.should.be.eql('success');
					res.body.message.should.be.eql('Contacts retrieved successfully');
					res.body.should.have.property('data');
					res.body.data.length.should.be.eql(1);
					res.body.data[0]._id.should.be.eql(createdContact._id);
					res.body.data[0].name.should.be.eql(model.name);
					res.body.data[0].email.should.be.eql(model.email);
					res.body.data[0].gender.should.be.eql(model.gender);
					res.body.data[0].phone.should.be.eql(model.phone);
					callWhenDone();
				});
		});
	});
	
	describe('Update the contact', function() {
		it('The contact should be updated', function(callWhenDone) {
			chai.request(resthub)
				.put('/api/contacts' + '/' + createdContact._id)
				.send(updatedModel)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.message.should.be.eql('Contact Info updated');
					res.body.should.have.property('data');
					res.body.data.name.should.be.eql(updatedModel.name);
					res.body.data.email.should.be.eql(updatedModel.email);
					res.body.data.gender.should.be.eql(updatedModel.gender);
					res.body.data.phone.should.be.eql(updatedModel.phone);
					updatedContact = res.body.data;
					callWhenDone();
				});
		});
	});
	
	describe('Check that the updated contact is reflected in the database', function() {
		it('The updated contact should be reflected in the database', function(callWhenDone) {
			chai.request(resthub)
					.get('/api/contacts')
					.end((err, res) => {
						res.should.have.status(200);
						res.should.be.an('object');
						res.body.status.should.be.eql('success');
						res.body.message.should.be.eql('Contacts retrieved successfully');
						res.body.should.have.property('data');
						res.body.data.length.should.be.eql(1);
						res.body.data[0]._id.should.be.eql(updatedContact._id);
						res.body.data[0].name.should.be.eql(updatedModel.name);
						res.body.data[0].email.should.be.eql(updatedModel.email);
						res.body.data[0].gender.should.be.eql(updatedModel.gender);
						res.body.data[0].phone.should.be.eql(updatedModel.phone);
						callWhenDone();
					});
		});
	});
	
	describe('Delete contact', function() {
		it('The contact should be deleted', function(callWhenDone) {
			chai.request(resthub)
				.delete('/api/contacts' + '/' + updatedContact._id)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.message.should.be.eql('Contact deleted');
					callWhenDone();
				});
		});
	});
	
	describe('Check that the contact is deleted', function() {
		it('Contact deletion should be reflected in the database', function(callWhenDone) {
			chai.request(resthub)
					.get('/api/contacts')
					.end((err, res) => {
						res.should.have.status(200);
						res.should.be.an('object');
						res.body.status.should.be.eql('success');
						res.body.message.should.be.eql('Contacts retrieved successfully');
						res.body.should.have.property('data');
						res.body.data.length.should.be.eql(0);
						callWhenDone();
					});
		});
	});
});
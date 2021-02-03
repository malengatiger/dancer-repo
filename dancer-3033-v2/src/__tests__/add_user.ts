import express from "express";

const request = require('supertest');
// const express = require('express');

const app = express();

// app.get('/user', function(req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { name: string; }): void; new(): any; }; }; }) {
//   res.status(200).json({ name: 'john' });
// });

// request(app)
//   .get('/user')
//   .expect('Content-Type', /json/)
//   .expect('Content-Length', '15')
//   .expect(200)
//   .end(function(err: any, res: any) {
//     if (err) throw err;
//   });

  console.log(`💙 💙 💙 get user does not fucking exist .... 💙 `)

  describe('POST /findUserByEmail', function() {
    it('responds with json', function(done) {
      request(app)
        .post('http://localhost:4000/findUserByEmail')
        .set('Accept', 'application/json')
        .expect(404, done)
        
    });
  });
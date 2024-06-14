import express from 'express';
import db from './db.js';
import passport from 'passport';
import Authentication from "./auth.js"
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch'; 

const dirname = fs.realpathSync('.');

class DictionaryBackendServer {
  constructor() {
    const app = express();
    app.use(express.json());
    app.use(express.static('public'));
    app.use(express.urlencoded({ extended: false }));
    const authentication = new Authentication(app);

    app.get('/loadflights/', authentication.checkAuthenticated, this.loadflights); 
    app.get('/loadcars/', authentication.checkAuthenticated, this.loadcars); 
    app.get('/loadhotels/', authentication.checkAuthenticated, this.loadhotels); 

    //app.get('/lookup/:word', authentication.checkAuthenticated, this.doLookup);
    //!!!ACA
    app.post('/save/', authentication.checkAuthenticated, this.doSave); //!!!! esteeeeee
    
    app.delete('/delete/', authentication.checkAuthenticated, this.doDelete);

    app.get('/login/', this.login);
    app.get('/', authentication.checkAuthenticated, this.goHome);

    // aca empiezan las diferencias con autenticacion local
    app.get('/auth/google/', passport.authenticate('google', {
       scope: ['email', 'profile']
      }));

    app.get('/auth/google/callback', passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

    app.post("/logout", (req,res) => {
     req.logOut(err=>console.log(err));
     res.redirect("/login");
   })
   
    // Start server
    app.listen(3000, () => console.log('Listening on port 3000'));
  }

  async login(req, res) {
    res.sendFile(path.join(dirname, "public/login.html"));
  }

  async goHome(req, res) {
    res.sendFile(path.join( dirname, "public/home.html"));
  }

  /*async doLookup(req, res) {
    const routeParams = req.params;
    const word = routeParams.word;
    const query = { word: word.toLowerCase() };
    const collection = db.collection("dict");
    const stored = await collection.findOne(query);
    const response = {
      word: word,
      definition: stored ? stored.definition : ''
    };
    res.json(response);
  }*/

//ACA LA FUNCION DE GUARDAR!!
  async doSave(req, res) {
    console.log(JSON.stringify(req.user.displayName));
    console.log(JSON.stringify(req.body));
    const user = req.user.displayName;
    
    const query = { user: user }; //CAMBIAR POR DESTINACION
    const update = { $set: { vuelo: req.body } };// ACA TODA LA DAT DE PRECIO AEROLINEA Y HORARIOS 
    const params = { upsert: true };
    const collection = db.collection("users");
    await collection.updateOne(query, update, params);
    res.json({ success: true });
    
  }

  async doDelete(req, res) {
    const word = req.body.word.toLowerCase();
    const query = { word: word };
    const collection = db.collection("dict");
    const deleted = await collection.findOneAndDelete(query);//esto chau
    res.json(deleted.value);
  }

  async loadflights(req,res){
    const API_URL = 'https://www.mockachino.com/96bb64f4-3b59-4e/flights'; 
    try {

        const response = await fetch(API_URL); // ERNESTO: obtenemos la informacion de la API mockeada
        const data = await response.json();
        res.json(data); // ERNESTO: enviamos la información procesada hacia el frontend

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }   
  }

  async loadcars(req,res){
    const API_URL = 'https://www.mockachino.com/85e71891-e526-4c/autos'; 
    try {

        const response = await fetch(API_URL); // ERNESTO: obtenemos la informacion de la API mockeada
        const data = await response.json();
        res.json(data); // ERNESTO: enviamos la información procesada hacia el frontend

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }   
  }

  async loadhotels(req,res){
    const API_URL = 'https://www.mockachino.com/d021f210-c8ab-49/hoteles'; 
    try {

        const response = await fetch(API_URL); // ERNESTO: obtenemos la informacion de la API mockeada
        const data = await response.json();
        res.json(data); // ERNESTO: enviamos la información procesada hacia el frontend

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }   
  }


}

new DictionaryBackendServer();
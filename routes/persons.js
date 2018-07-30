var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

    router.use(bodyParser.urlencoded({ extended: true }))
    router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
      }
}))
router.route('/')
    //GET all persons
    .get(function(req, res, next) {
        //retrieve all persons from Monogo
        mongoose.model('Person').find({}, function (err, persons) {
              if (err) {
                  return console.error(err);
              } else {
                    res.format({
                        html: function(){
                        res.render('persons/index', {
                              title: 'All my persons',
                              "persons" : persons
                          });
                    },
                    //JSON response will show all persons in JSON format
                    json: function(){
                        res.json(persons);
                    }
                });
              }
        });
    })
    //POST a new person
  .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var Name = req.body.Name;
        var Surname = req.body.Surname;
        var CreatedDate = req.body.CreatedDate;
        var City = req.body.City;
        var Adress = req.body.Adress;
        var Phone = req.body.Phone;
        //call the create function for our database
        mongoose.model('Person').create({
            Name : Name,
            Surname : Surname,
            CreatedDate : CreatedDate,
            City : City,
            Adress : Adress,
            Phone : Phone
        }, function (err, person) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //Person has been created
                  console.log('POST creating new person: ' + person);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("persons");
                        // And forward to success page
                        res.redirect("/persons");
                    },
                    //JSON response will show the newly created persons
                    json: function(){
                        res.json(person);
                    }
                });
              }
        })
    });

    router.get('/new', function(req, res) {
        res.render('persons/new', { title: 'Add New Person' });
    });

    // route middleware to validate :id
    router.param('id', function(req, res, next, id) {
        //console.log('validating ' + id + ' exists');
        //find the ID in the Database
        mongoose.model('Person').findById(id, function (err, person) {
            //if it isn't found, we are going to repond with 404
            if (err) {
                console.log(id + ' was not found');
                res.status(404)
                var err = new Error('Not Found');
                err.status = 404;
                res.format({
                    html: function(){
                        next(err);
                     },
                    json: function(){
                           res.json({message : err.status  + ' ' + err});
                     }
                });
            //if it is found we continue on
            } else {

                req.id = id;
                // go to the next thing
                next();
            }
        });
    });



    router.route('/:id')
      .get(function(req, res) {
        mongoose.model('Person').findById(req.id, function (err, person) {
          if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
          } else {
            console.log('GET Retrieving ID: ' + person._id);
            res.format({
              html: function(){
                  res.render('persons/show', {
                    "Name" : Name,
                    "Surname" : Surname,
                    "CreatedDate" : CreatedDate,
                    "City" : City,
                    "Adress" : Adress,
                    "Phone" : Phone
                  });
              },
              json: function(){
                  res.json(person);
              }
            });
          }
        });
      });



router.route('/:id/edit')
      .get(function(req, res) {
    //search for the person within Mongo
    mongoose.model('Person').findById(req.id, function (err, person) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the person
            console.log('GET Retrieving ID: ' + person._id);
            //format the date properly for the value to show correctly in our edit form
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                       res.render('persons/edit', {
                          title: 'Person' + person._id,
                          "Name" : Name,
                          "Surname" : Surname,
                          "CreatedDate" : CreatedDate,
                          "City" : City,
                          "Adress" : Adress,
                          "Phone" : Phone
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(person);
                 }
            });
        }
    });
})


//PUT to update a person by ID
   .put(function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var Name = req.body.Name;
    var Surname = req.body.Surname;
    var CreatedDate = req.body.CreatedDate;
    var City = req.body.City;
    var Adress = req.body.Adress;
    var Phone = req.body.Phone;
   //find the document by ID
        mongoose.model('Person').findById(req.id, function (err, person) {
            //update it
            person.update({
              Name : Name,
              Surname : Surname,
              CreatedDate : CreatedDate,
              City : City,
              Adress : Adress,
              Phone : Phone
            }, function (err, personID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              }
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/persons/" + person._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(person);
                         }
                      });
               }
            })
        });
})



//DELETE a person by ID
   .delete(function (req, res){
    //find person by ID
    mongoose.model('Person').findById(req.id, function (err, person) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            person.remove(function (err, person) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + person._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/persons");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : person
                               });
                         }
                      });
                }
            });
        }
    });
});

module.exports = router;

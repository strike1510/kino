// controllers/carsapi.route.js
const express = require('express');
const router = express.Router();
const carRepo = require('../utils/cars.repository');

router.get('/brands', brandListAction);
router.get('/list', carListAction);
router.get('/show/:carId', carShowAction);
router.get('/del/:carId', carDelAction);
router.post('/update/:carId', carUpdateAction);

// http://localhost:9000/carsapi/brands
async function brandListAction(request, response) {
    var brands = await carRepo.getAllBrands();
    response.send(JSON.stringify(brands));
}

async function carListAction(request, response) {
    var cars = await carRepo.getAllCars();
    response.send(JSON.stringify(cars));
}
async function carShowAction(request, response) {
    var oneCar = await carRepo.getOneCar(request.params.carId);
    response.send(JSON.stringify(oneCar));
}
async function carDelAction(request, response) {
    // TODO: first remove extras for car, unless the car cannot be removed!!!
    var numRows = await carRepo.delOneCar(request.params.carId);
    let result = { rowsDeleted: numRows };
    response.send(JSON.stringify(result));
}
async function carUpdateAction(request, response) {
    // var json = JSON.stringify(request.body); // bodyParser can process json in body + regular POST form input too
    // console.log(json);
    // TODO: !!! INPUT VALIDATION !!!
    var carId = request.params.carId;
    if (carId==="0") carId = await carRepo.addOneCar(request.body.car_brand);
    var isFancy = (request.body.car_isfancy === undefined || request.body.car_isfancy === false) ? 0 : 1; 
    var numRows = await carRepo.editOneCar(carId, 
        request.body.car_brand, 
        request.body.car_name, 
        request.body.car_baseprice, 
        isFancy, 
        request.body.car_realprice);
    let result = { rowsUpdated: numRows };
    response.send(JSON.stringify(result));
}

module.exports = router;
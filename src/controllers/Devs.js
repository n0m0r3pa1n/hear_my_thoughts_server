var Developer = require('../models').Developer
export default class DevelopersController {
    contructor() {

    }

    *getAll() {
        var devs = yield Developer.find({}).exec()
        console.log(devs)
        return devs
    }

    add() {
        var dev = new Developer({email: "Test123"})
        dev.save()
        return dev;
    }
}

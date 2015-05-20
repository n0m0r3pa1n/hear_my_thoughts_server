import DevelopersController from '../controllers/Devs.js'
export default [
    {
        method: "GET",
        path: "/devs",
        handler: function*(req,reply) {
            let ctrl = new DevelopersController();
            ctrl.add()
            reply(yield ctrl.getAll());
        },
        config: {
            validate: {
            },
            description: 'Test',
            tags: ['api']
        }
    }
]
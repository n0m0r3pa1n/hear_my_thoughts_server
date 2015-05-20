import devs_routes from './routes/devs_routes.js'
import users_routes from './routes/users_routes.js'
let routes = []
routes = routes.concat(devs_routes)
routes = routes.concat(users_routes)

export default routes
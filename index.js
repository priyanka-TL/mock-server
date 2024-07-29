const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
require('dotenv').config({ path: './.env' });

const PORT = process.env.APPLICATION_PORT;
app.use(express.json());

// Load routes configuration from routes.json
const routesConfigPath = path.join(__dirname, 'routeConfig', 'routes.json');
const routesConfig = JSON.parse(fs.readFileSync(routesConfigPath, 'utf8'));

// Utility function to find route config by method and path
const findRouteConfig = (method, path) => {
    return routesConfig.routes.find(route => route.route === path && route.method === method);
};

// Handle requests based on routes configuration
app.use((req, res) => {
    const routeConfig = findRouteConfig(req.method, req.path);
    console.log(req.path,'req.path')
    if (routeConfig) {
        // Respond with the mock data from the routes configuration
        res.status(200).json(routeConfig.returnData);
    } else {
        // If the route is not found, respond with a 404 error
        res.status(404).json({
            "id": "api.error.not_found",
            "responseCode": "NOT_FOUND",
            "result": {}
        });
    }
});

app.listen(PORT, () => {
	console.log(`Server is running on http://${process.env.APPLICATION_HOST}:${PORT}`);
});

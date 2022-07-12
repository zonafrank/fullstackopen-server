const weatherRouter = require("express").Router();
const axios = require("axios");

weatherRouter.get("/", (request, response) => {
  const { city, country } = request.query;
  console.log(request.query);
  axios
    .get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    )
    .then((weatherApiResponse) => {
      return response.json(weatherApiResponse.data);
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).send({ error: error.message });
    });
});

module.exports = weatherRouter;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Http;
using System.Text.Json;

namespace search_flight.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FlightsController : ControllerBase
    {

        private readonly ILogger<FlightsController> _logger;

        public FlightsController(ILogger<FlightsController> logger)
        {
            _logger = logger;
        }

        string urlFlight = "http://flight_adapter/";

        [HttpGet("{destAirport}")]
        public async Task<IActionResult> Get(string destAirport)
        {
            //check if airport exists
            string url = urlFlight + "airports/"+ destAirport;
            HttpClient client = new HttpClient();
            Uri uri = new Uri(url);
            HttpResponseMessage reponse = await client.GetAsync(uri);
            if(reponse.StatusCode == HttpStatusCode.OK) {
                //get the possible flights
                string urlFlights = urlFlight + "flights/airports/"+ destAirport;
                Uri uriFlights = new Uri(urlFlights);
                var content = await client.GetStringAsync(uriFlights);
                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    WriteIndented = true
                };

                List<Flight> flights = JsonSerializer.Deserialize<List<Flight>>(content, options);
                
                return Ok(flights);
            }
            else {
                //invalid airport code
                return BadRequest("Invalid airport number!");
            }
        }
    }
}

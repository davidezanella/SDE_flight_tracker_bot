using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Text;

namespace calculate_route_time.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RouteController : ControllerBase
    {
        private readonly ILogger<RouteController> _logger;

        public RouteController(ILogger<RouteController> logger)
        {
            _logger = logger;
        }

        string urlFlight = "http://flight_adapter/";
        string urlRoute = "http://route_adapter/";

        [HttpPost]
        public async Task<IActionResult> Calculate(Params p)
        {            
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };

            //check if airport exists
            string url = urlFlight + "airports/" + p.airport;
            HttpClient client = new HttpClient();
            Uri uri = new Uri(url);
            HttpResponseMessage reponse = await client.GetAsync(uri);
            if(reponse.StatusCode == HttpStatusCode.OK) {
                string data = await reponse.Content.ReadAsStringAsync();
                Airport airport = JsonSerializer.Deserialize<Airport>(data, options);

                //get the route
                Uri uriRoute = new Uri(urlRoute);

                RouteParams rp = new RouteParams() {
                    startLat = p.latitude,
                    startLon = p.longitude,
                    endLat = airport.latitude-0.007f,
                    endLon = airport.longitude-0.007f,
                    mean = "car"
                };

                string jsonString = JsonSerializer.Serialize(rp);
                var content = new StringContent(jsonString, Encoding.UTF8, "application/json");
                var response = await client.PostAsync(uriRoute, content);

                string time = await response.Content.ReadAsStringAsync();
                RouteResponse result = JsonSerializer.Deserialize<RouteResponse>(time, options);

                return Ok(result);
            }
            else {
                //invalid airport code
                return BadRequest("Invalid airport number!");
            }
        }
    }
}

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

namespace register_flight_user.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserFlightController : ControllerBase
    {
        private readonly ILogger<UserFlightController> _logger;

        public UserFlightController(ILogger<UserFlightController> logger)
        {
            _logger = logger;
        }

        string urlFlight = "http://flight_adapter/";
        string urlUserFlightAdapter = "http://user-flight_adapter/";

        [HttpPost]
        public async Task<IActionResult> Insert(UserFlight uf)
        {
            //check if flight exists
            string url = urlFlight + "flights/"+ uf.flightNumber;
            HttpClient client = new HttpClient();
            Uri uri = new Uri(url);
            HttpResponseMessage reponse = await client.GetAsync(uri);
            if(reponse.StatusCode == HttpStatusCode.OK) {
                //register the user-flight relation
                Uri uriUserFlight = new Uri(urlUserFlightAdapter);
                
                string jsonString = JsonSerializer.Serialize(uf);

                var content = new StringContent(jsonString, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(uriUserFlight, content);

                return StatusCode((int)response.StatusCode);
            }
            else {
                //invalid flight code
                return BadRequest("Invalid flight number!");
            }
        }
    }
}

using System;

namespace search_flight
{
    public class Flight
    {
        public string depAirport { get; set; }

        public string arrAirport { get; set; }

        public DateTime depTime { get; set; }

        public DateTime arrTime { get; set; }

        public string status { get; set; }

        public string flightId { get; set; }
    }
}

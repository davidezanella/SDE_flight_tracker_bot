using System;

namespace calculate_route_time
{
    public class Params
    {
        public float latitude { get; set; }

        public float longitude { get; set; }

        public string airport { get; set; }
    }
    
    public class RouteParams
    {
        public float startLat { get; set; }

        public float startLon { get; set; }
        public float endLat { get; set; }

        public float endLon { get; set; }

        public string mean { get; set; }
    }
    
    public class RouteResponse
    {
        public float distance { get; set; }

        public float duration { get; set; }
    }
}

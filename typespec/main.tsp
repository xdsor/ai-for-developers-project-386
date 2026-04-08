import "@typespec/http";
import "./models.tsp";
import "./operations.tsp";

using Http;

@service(#{ title: "Meeting Booking Service" })
namespace MeetingBooking;

import { location_reservation, reservation, status } from "@/components/basic/lecturer";
import dayjs from "dayjs";

export default function event() {
  const reservation: reservation = {
    uuid: "605babb7-36d2-4eb5-9023-5e4e17d441b7",
    status: status.reserved,
    location: location_reservation.online,
    start_time: dayjs().toDate(),
    end_time: dayjs().toDate(),
    subject: [
      {
        uuid: "e90a9647-fad6-4345-a33b-a1179529cf36",
        name: "Project Management",
      },
      {
        uuid: "bafaabd7-9ed9-4a68-b562-fa506ee770ca",
        name: "Creative Workshop",
      },
    ],
  };
  return (
    <div>
      <h1>{reservation.status}</h1>
      <p>{reservation.location}</p>
      <p>{dayjs(reservation.start_time).toString()} - {dayjs(reservation.end_time).toString()}</p>
      {reservation.subject.map((subject) => (
        <div key={subject.uuid}>{subject.name}</div>
      ))}
    </div>
  );
}

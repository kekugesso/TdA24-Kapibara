import { Lecturer_Full } from "@/components/lecturer";

export default function Profile({ lecturer }: { lecturer: Lecturer_Full }) {
  return (
    <div>
      <h2>{lecturer.fullName}</h2>
      <p>Location: {lecturer.location}</p>
      <p>Claim: {lecturer.claim}</p>
      <p>Price per Hour: {lecturer.price_per_hour}</p>
      <p>Bio: {lecturer.bio}</p>
      <p>Contact: {lecturer.contact.telephone_numbers.join(', ')}</p>
      <p>Emails: {lecturer.contact.emails.join(', ')}</p>
      <p>Reservations:</p>
      <ul>
        {lecturer.reservations.map(reservation => (
          <li key={reservation.uuid}>
            <p>Start Time: {reservation.start_time.toString()}</p>
            <p>End Time: {reservation.end_time.toString()}</p>
            <p>Location: {reservation.location}</p>
            <p>Status: {reservation.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

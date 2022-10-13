export default interface EventTicketsDto {
  number: string;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  clientId: number;
  client: {
    imageUrl: string;
    name: string;
    phoneNumber: string;
    emailAddress: string;
    id: number;
  };
  eventId: number;
  id: number;
}

/* eslint-disable */

import { L } from '../i18next';

export enum IsActiveWithShopStatus {
  Inactive = 0,
  Active = 1,
  ActiveForShopOnly = 2,
}
export enum EmailTargetType {
  Client = 0,
  ShopManager = 1,
  EventOrganizer = 2,
}

export enum EventTypes {
  Free = 0,
  PayWithEnterance = 1,
  PayWithSeats = 2,
  Private = 3,
  Online = 4,
}
export enum EventOccoursOptions {
  None = 0,
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
}
export enum ToDoPriority {
  Normal = 0,
  Important = 1,
  VeryImportant = 2,
}
export enum AppointmentRepeat {
  None = 0,
  Daily = 1,
  Weekly = 2,
  EveryMonth = 3,
}
export enum LifeDreamStepStatus {
  NotAchieved = 0,
  Achieved = 1,
}
export enum AppointmentReminder {
  BeforeOneDay = 0,
  BeforeOneHour = 1,
  Before15Minutes = 2,
}

export enum EventFeesOptions {
  AbsorbFees = 0,
  ChargeToCustomer = 1,
}
export enum EventStatus {
  Inactive = 0,
  Active = 1,
  Closed = 2,
}

export enum ExerciseType {
  WarmUp = 0,
  MainWorkout = 1,
  CoolDown = 2,
}
export enum CommentRefType {
  Post = 0,
  Event = 1,
  News = 2,
  Moment = 3,
}

export enum InteractionType {
  Sad = 0,
  Happy = 1,
  Love = 2,
  Angry = 3,
  Wow = 4,
  Like = 5,
  DisLike = 6,
}
export enum InteractionRefType {
  Story = 0,
  News = 1,
  Moment = 2,
}

export function getIsActiveWithShopStatusOptions(): Array<any> {
  return [
    {
      value: IsActiveWithShopStatus.Inactive,
      text: L('Inactive'),
    },
    {
      value: IsActiveWithShopStatus.Active,
      text: L('Active'),
    },
    {
      value: IsActiveWithShopStatus.ActiveForShopOnly,
      text: L('ActiveForShopOnly'),
    },
  ];
}

export enum StoryType {
  Courses = 0,
  Dishes = 1,
}

export enum ReportRefType {
  Product = 0,
  Shop = 1,
}

export enum UserStatus {
  Inactive = 0,
  Active = 1,
  Blocked = 2,
}

export enum VehicleType {
  Car = 0,
  Motorcycle = 1,
  Bicycle = 2,
  Van = 3,
  Truck = 4,
  Bus = 5,
}

export enum OfferType {
  Order = 0,
  Product = 1,
}

export enum LicenseType {
  A = 0,
  B = 1,
  C = 2,
  D = 3,
}

export enum LocationType {
  Country = 0,
  City = 1,
  Neighbourhood = 2,
}

export enum QuestionType {
  Personality = 0,
  Preference = 1,
}

export enum PaymentMethod {
  Cash = 0,
  CreditCard = 1,
  ApplePay = 2,
  Mada = 3,
  STCPay = 4,
}

export enum ProductType {
  Sale = 0,
  Rent = 1,
  NumberOfPeople = 2,
  Weight = 3,
}

export enum ShopType {
  Individual = 0,
  Corporation = 1,
  Company = 2,
  Charity = 3,
}

export enum ReviewRefType {
  Shop = 0,
  Product = 1,
}

export enum StockStatus {
  InStock = 1,
  OutOfStock = 0,
}

export enum OrderType {
  Waiting = 0,
  Approved = 10,
  InProgress = 11,
  OnTheWay = 12,
  Delivered = 13,
  Cancelled = 20,
  Rejected = 21,
}

export enum EventType {
  Main = 0,
  Special = 1,
}

export enum GenderType {
  Female = 0,
  Male = 1,
  Other = 2,
}

export enum IndexType {
  Bank = 0,
  Quote = 1,
}

export enum AzkarCategory {
  Morning = 0,
  Evening = 1,
  AfterPrayer = 2,
}

export enum BundlesPeriodType {
  Day = 0,
  Monthly = 0,
  Yearly = 0,
  Unlimited = 0,
}

export enum CouponType {
  IsFreeShipping = 0,
  ForShop = 1,
  ForClient = 2,
  Other = 3,
}

export enum PriceType {
  Person = 0,
  Seat = 1,
}

export enum FeesType {
  AbsorbFee = 0,
  ChargeToCustomer = 1,
}
export enum TicketCategory {
  Golden = 1,
  Sliver = 0,
  Platinum = 2,
  Vip = 3,
}
export enum UserType {
  Admin = 0,
  Client = 1,
  ShopManager = 2,
  EventOrganizer = 3,
}

export enum MonthName {
  NotSet = 0,
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12,
}

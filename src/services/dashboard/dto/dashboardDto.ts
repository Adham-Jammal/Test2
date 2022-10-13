export interface AdminStatistcsDto {
  activeClients: number;
  activeShops: number;
  activeOrganizers: number;
  activeChallenges: number;
  activeStories: number;
  profit: number;
  pendingShops: number;
  pendingOrganizers: number;
}

export interface ShopStatisticsDto {
  activeProducts: number;
  activeCoupons: number;
  activePromotions: number;
  profit: number;
  waitingOrders: number;
  inprogressOrders: number;
  returnedOrders: number;
  deliveredOrders: number;
  onTheWayOrders: number;
  approvededOrders: number;
  cancelledOrders: number;
}

export interface OrganizerStatisticsDto {
  activeFreeEvents: number;
  activeOnlineEvents: number;
  activePrivateEvents: number;
  activePayWithSeatsEvents: number;
  activePayWithEntranceEvents: number;
  runningEvents: number;
  tickets: number;
  usedTickets: number;
  profit: number;
}

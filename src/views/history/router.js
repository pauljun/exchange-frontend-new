export default {
  Recharge: () => import("@/views/history/index.vue"),
  Withdrawal: () => import("@/views/history/withdrawal.vue"),
  Trade: () => import("@/views/history/trade.vue"),
  Bet: () => import("@/views/history/bet.vue"),
  Exchange: () => import("@/views/history/exchange.vue"),
  Money: () => import("@/views/history/money.vue"),
};

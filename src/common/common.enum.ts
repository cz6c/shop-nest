/** 性别枚举 */
export enum Gender {
  MEN = 1,
  WOMEN = 2,
}

/** 订单状态枚举 */
export enum OrderState {
  /** 待付款 */
  DaiFuKuan = 1,
  /** 待发货 */
  DaiFaHuo = 2,
  /** 待收货 */
  DaiShouHuo = 3,
  /** 待评价 */
  DaiPingJia = 4,
  /** 已完成 */
  YiWanCheng = 5,
  /** 已取消 */
  YiQuXiao = 6,
}

/** 订单状态枚举 */
export enum PayChannel {
  /** 支付宝 */
  Alipay = 1,
  /** 微信 */
  WxPay = 2,
}

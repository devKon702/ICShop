const paymentServices = {
  vietQr: new VietQrService(),
};
class PaymentFactory {
  public getService(service: keyof typeof paymentServices): PaymentService {
    return paymentServices[service];
  }
}

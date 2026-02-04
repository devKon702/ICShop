class AccountService {
  public async adminUpdateEmail(data: {
    newEmail: string;
    newEmailOtp: string;
    currentEmailOtp: string;
  }) {}
}

export default new AccountService();

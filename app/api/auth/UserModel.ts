export type UserModel = {
  username: string;
  email: string;
  password: string;
  wallet: WalletModel;
}


export type WalletModel = {
  address: string;
  balance: number;
}
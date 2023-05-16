export interface CreateAccountProps {
  ok: boolean;
  error?: string;
}

export interface LoginProps extends CreateAccountProps {
  token?: string;
}

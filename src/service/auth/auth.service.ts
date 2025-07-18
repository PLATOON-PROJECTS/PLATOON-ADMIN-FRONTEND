import { http } from "../../core/utils/http";
import authHeader from "../../core/utils/auth.header.js";
import axios, { Axios } from "axios";
import {
  Register,
  Login,
  ForgotPasswordInit,
  ForgotPasswordComplete,
  ChangePassword,
  ResetPassword,
  Update,
} from "./interface/auth.interface";
import authhHeader from "../../core/utils/authh.header";

class AuthService {
  constructor(private readonly request: Axios) {}
  private createAxiosInstance() {
    return axios.create({
      baseURL: import.meta.env.VITE_PLATOON_BASEURL, // Set your custom base URL here
      headers: authhHeader(), // Include any headers you need
    });
  }
  // async register(data: Register): Promise<any> {
  //   return await this.request
  //     .post("/register", { ...data })
  //     .then((res) => {
  //       return res;
  //     })
  //     .catch((err) => {
  //       return err;
  //     });
  // }
  async register(data: Register): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .post(
        "/Organisation/Register",
        {
          email: data.email,
          password: data.password,
          organisationName: data.company,
        },
        {
          headers: authhHeader(),
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async sendEmailConfirmationLink(data: { email: string }): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .post("/Authentication/send-email-confirmation-link", data, {
        headers: authhHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.error("Email confirmation error:", err);
        return err;
      });
  }

  // async register(data: Register): Promise<any> {
  //   return await this.request
  //     .post("/register", { ...data })
  //     .then((res) => {
  //       return res;
  //     })
  //     .catch((err) => {
  //       return err;
  //     });
  // }
  // async updateProfile(data: Update): Promise<any> {
  //   return await this.request
  //     .post("/profile", data, { headers: authHeader() })
  //     .then((res) => {
  //       // console.log(res);
  //       return res;
  //     })
  //     .catch((err) => {
  //       // console.log(err);
  //       return err;
  //     });
  // }

  async updateAdminProfile(data: any): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .put("/Admin/update", data, {
        headers: {
          ...authhHeader(),
          "Content-Type": "application/json-patch+json",
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  // async login(data: Login): Promise<any> {
  //   return await this.request
  //     .post("/login", {
  //       ...data,
  //     })
  //     .then((res) => {
  //       return res;
  //     })
  //     .catch((err) => {
  //       return err;
  //     });
  // }

  async loginn(data: Login): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .post(
        "/Authentication/login",
        {
          email: data.email,
          password: data.password,
        },
        {
          headers: authhHeader(),
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async signInWithGoogle(url: string): Promise<any> {
    return await this.request
      .get(url)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async googleLogin(token: string): Promise<any> {
    return await this.request
      .post(`/login/google/${token}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async forgotPasswordInit(email: string): Promise<any> {
    const customRequest = this.createAxiosInstance();
    return await customRequest
      .post(
        `/Authentication/forget-password?Email=${encodeURIComponent(email)}`,
        null,
        {
          headers: authhHeader(),
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async changePassword(data: ChangePassword): Promise<any> {
    return await this.request
      .post(`/forgot/verify`, {
        ...data,
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async changeThePassword(data: { newPassword: string }): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .put("/Authentication/change-password", data, {
        headers: {
          ...authHeader(),
          "Content-Type": "application/json-patch+json",
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async forgotPasswordComplete(data: ForgotPasswordComplete): Promise<any> {
    return await this.request
      .post(`/forgot/complete`, {
        ...data,
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async resetPassword(data: ResetPassword): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .post(
        "/Authentication/reset-password",
        {
          email: data.email,
          token: data.token,
          newPassword: data.newPassword,
        },
        {
          headers: authhHeader(),
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async confirmEmail(data: { email: string; token: string }): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .post("/Authentication/confirm-email", data, {
        headers: authhHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.error("Email confirmation error:", err);
        return err;
      });
  }

  async logout(): Promise<any> {
    const customRequest = this.createAxiosInstance();
    return await customRequest
      .put(
        "/Authentication/logout",
        {},
        {
          headers: authhHeader(),
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async registerEmployee(data: {
    inviteId: string;
    password: string;
  }): Promise<any> {
    try {
      const customRequest = this.createAxiosInstance();

      const response = await customRequest.post(
        "/Employee/Register",
        {
          inviteId: data.inviteId,
          password: data.password,
        },
        {
          headers: authhHeader(), // Custom auth header function
        }
      );

      return response;
    } catch (error: any) {
      if (error.response) {
        console.error("Registration error (response):", error.response.data);
        return Promise.reject(error.response.data);
      } else {
        console.error("Registration error (message):", error.message);
        return Promise.reject(error.message);
      }
    }
  }

  async profile(): Promise<any> {
    return await this.request
      .get("/profile", {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
}

export default new AuthService(http);

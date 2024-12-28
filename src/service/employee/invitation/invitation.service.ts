import { http } from "../../../core/utils/http";
import authHeader from "../../../core/utils/auth.header.js";
import axios, { Axios } from "axios";
import { Create } from "./interface/invitation.interface";
import authhHeader from "../../../core/utils/authh.header";

class EmployeeInvitation {
  constructor(private readonly request: Axios) {}

  private createAxiosInstance() {
    return axios.create({
      baseURL: "https://platoon-backend.onrender.com/api", // Set your custom base URL here
      headers: authhHeader(), // Include any headers you need
    });
  }

  // async index(): Promise<any> {
  //   return await this.request
  //     .get("/employee/invites", {
  //       headers: authHeader(),
  //     })
  //     .then((res) => {
  //       return res;
  //     })
  //     .catch((err) => {
  //       return err;
  //     });
  // }
  async index(): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get("/Invite/pending-invite-count", {
        headers: authhHeader(),
      })
      .then((res) => {
        console.log("Pending==========",res)
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async allIndex(pageSize: number = 10, pageNumber: number = 1): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get("/Invite/Get-Pending-Invites", {
        headers: authhHeader(),
        params: {
          PageSize: pageSize,
          PageNumber: pageNumber
        }
      })
      .then((res) => {
        console.log("All Pending==========",res)
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  // async create(data: Create): Promise<any> {
  //   return await this.request
  //     .post(
  //       "/employee/invites",
  //       { ...data },
  //       {
  //         headers: authHeader(),
  //       }
  //     )
  //     .then((res) => {
  //       return res;
  //     })
  //     .catch((err) => {
  //       return err;
  //     });
  // }

  async create(data: Create): Promise<any> {

    const customRequest = this.createAxiosInstance();

    return await customRequest
      .post(
        "/Invite/send-employee-invite", 
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          countryCode: data.countryCode,
          employmentType: data.employmentType,
          gradeId: data.gradeId,
          // gradeId: data.gradeId,
          departmentId: data.departmentId,
        },
        {
          headers: authhHeader(),
        }
      )
      .then((res) => {
        console.log("==========",res)
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
}

export default new EmployeeInvitation(http);

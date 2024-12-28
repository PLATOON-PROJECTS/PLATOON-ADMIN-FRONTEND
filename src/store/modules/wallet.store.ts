import { defineStore } from "pinia";

import walletService from "../../service/wallets/wallet.service";
import { Transfer } from "../../service/wallets/interface/wallet.interface";

interface State {}
const walletStore = defineStore("wallet", {
  state: () => ({
      // the main store to keep the unedited data 
      chartInfo: {
          name: [''],
          rate: [0]
      },
      
      // released to the user
      updatedChartInfo: {
          name: [''],
          rate: [0]
      },

      totalAmount: 0,
      years: [],
  }),
  getters: {
    getYear():any 
      {

      },
    chartData():any 
      {
          return {
              labels: [ 
                'Jan', 
                'Feb', 
                'Mar', 
                'Apr', 
                'May', 
                'Jun', 
                'Jul',
                'Aug', 
                'Sep', 
                'Oct', 
                'Nov', 
                'Dec'
              ],
              datasets: [ 
                {
                  label: "Salary",
                  data: this.updatedChartInfo.rate,
                  backgroundColor: "#003b3d",
                  borderColor: "rgba(34, 34, 34, 0.12)",
                  barThickness: 30,
                },
              ],
          }
      },
      chartOptions():any 
      {
          return {
            elements: {
              bar: { borderRadius: 4 },
            },
            plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                    callbacks: {
                      label(context: any) {
                        return `₦ ${context.formattedValue}`;
                      },
                    },
                },
            },
            responsive: true,
            scales: {
              x: {
                stacked: true,
                grid: {
                  display: false,
                },
                ticks: {
                  color: "rgba(34, 34, 34, 0.38)",
                },
              },
              y: {
                stacked: true,
                grid: {
                  color: "rgba(34, 34, 34, 0.12)",
                  lineWidth: 1,
                },
                border: {
                  dash: [8, 10],
                  dashOffset: 4,
                  color: "rgba(34, 34, 34, 0.12)",
                },
                ticks: {
                  callback: function (value:string) {
                    return "₦ "+value;
                  },
                  color: "rgba(34, 34, 34, 0.38)",
                },
              },
            },
          }
      }
  },
  actions: {
    async getWallet(): Promise<any> {
      try {
        const response = await walletService.getWallet();
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async getBanks(): Promise<any> {
      try {
        const response = await walletService.getBanks();
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async transfer(data: Transfer): Promise<any> {
      try {
        const response = await walletService.transfer(data);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async create(): Promise<any> {
      try {
        const response = await walletService.createWallet();
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },

    async getWalletHistory(): Promise<any> {
      try {
        const response = await walletService.getWalletHistory();
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },

    async getChartYears(): Promise<any> {
      try {
        const response = await walletService.getChartYears();
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },

    async getChartDetail(chartYear:number): Promise<any> {
      try {
        const response = await walletService.getChartData(chartYear);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },

    async initChart(data:any): Promise<any> {
      this.chartInfo.rate = Object.values(data)
      this.updatedChartInfo.rate = this.chartInfo.rate
      this.totalAmount = 0;

      for (let key in data) {
        this.totalAmount += data[key];
      }
    },
    async updateChart(data:any): Promise<any> {
      this.chartInfo.rate = Object.values(data)
      this.updatedChartInfo.rate = this.chartInfo.rate
      this.totalAmount = 0;

      for (let key in data) {
        this.totalAmount += data[key];
      }
    }
  },
});

export default walletStore;

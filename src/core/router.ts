import { createRouter, createWebHistory, useRoute } from "vue-router";
import isAuthenticated from "./helpers/authenticate";
// layouts
const AuthLayout = () => import("../layouts/AuthLayout.vue");
const DashboardLayout = () => import("../layouts/DashboardLayout.vue");
const PayrollLayout = () => import("../layouts/PayrollLayout.vue");
const PensionLayout = () => import("../layouts/PensionLayout.vue");
const HealthLayout = () => import("../layouts/HealthLayout.vue");
const EmployeeLayout = () => import("../layouts/EmployeeLayout.vue");
const WalletLayout = () => import("../layouts/WalletLayout.vue");
const CompanySettingsLayout = () =>
  import("../layouts/CompanySettingsLayout.vue");
const ManageUsersLayout = () => import("../layouts/ManageUsersLayout.vue");
const ManageAdminPermissionLayout = () =>
  import("../layouts/ManageAdminPermissionLayout.vue");
const SingleDepartmentLayout = () =>
  import("../layouts/SingleDepartmentLayout.vue");
const TaxLayout = () => import("../layouts/TaxLayout.vue");
const TaxSettingsLayout = () => import("../layouts/TaxSettingsLayout.vue");

// Not found page
const NotFoundPage = () => import("../pages/PageNotFound.vue");

const ViewEmployeeSalaryBreakDown = () =>
  import("../pages/dashboard/employees/employee/EmployeeSalaryBreakDown.vue");

// Auth Pages
const LoginPage = () => import("../pages/auth/Login.vue");
const SignupPage = () => import("../pages/auth/Signup.vue");
const ForgottenPassword = () => import("../pages/auth/ForgottenPassword.vue");
const ChangePassword = () => import("../pages/auth/ChangePassword.vue");
const ResetPassword = () => import("../pages/auth/ResetPassword.vue");
const ConfirmEmail = () => import("../pages/auth/ConfirmEmail.vue");
const RegisterEmployee = () => import("../pages/auth/RegisterEmployee.vue");

// dashboard
const HomePage = () => import("../pages/dashboard/Home.vue");
const WalletPage = () => import("../pages/dashboard/Wallet.vue");

//Companies
const CompaniesPage = () =>
  import("../pages/dashboard/companies/Companies.vue");

//employees
// const EmployeesPage = () =>
//   import("../pages/dashboard/employees/Employees.vue");

// const PendingEmployeePage = () =>
//   import("../pages/dashboard/employees/PendingEmployees.vue");
// const EmployeeDepartmentPage = () =>
//   import("../pages/dashboard/employees/Departments.vue");

// departments
const DepartmentEmployees = () =>
  import("../pages/dashboard/employees/departments/DepartmentEmployees.vue");
const DepartmentPayrollSettings = () =>
  import(
    "../pages/dashboard/employees/departments/DepartmentPayrollSettings.vue"
  );
const DepartmentSettings = () =>
  import("../pages/dashboard/employees/departments/DepartmentSettings.vue");

// single employee
const ViewEmployeeLayout = () => import("../layouts/ViewEmployeeLayout.vue");

const ViewEmployeeDetails = () =>
  import("../pages/dashboard/employees/employee/EmployeeDetails.vue");

const ViewEmployeePayrollHistory = () =>
  import("../pages/dashboard/employees/employee/EmployeePayrollHistory.vue");

// payroll
const PreviewPayroll = () =>
  import("../pages/dashboard/payroll/PreviewPayroll.vue");
const PayrollApprovedPage = () =>
  import("../pages/dashboard/payroll/SinglePayroll.vue");
const PendingApprovalPage = () =>
  import("../pages/dashboard/payroll/SinglePendingPayroll.vue");
const PayrollDraftPage = () => import("../pages/dashboard/payroll/Drafts.vue");
const PayrollDraftTwoPage = () =>
  import("../pages/dashboard/payroll/Draft-Two.vue");
const PayrollCreatePage = () =>
  import("../pages/dashboard/payroll/CreateNew.vue");
const ConfirmPayrollPage = () =>
  import("../pages/dashboard/payroll/PreviewNewPayroll.vue");
const PayrollSummaryPage = () =>
  import("../pages/dashboard/payroll/PayrollSummary.vue");
const PayrollHistoryPage = () =>
  import("../pages/dashboard/payroll/History.vue");
const PendingPayrollPage = () =>
  import("../pages/dashboard/payroll/PendingPayroll.vue");
const PayrollSettingsPage = () =>
  import("../pages/dashboard/payroll/Settings.vue");

// health
const ExcludedHealthPage = () =>
  import("../pages/dashboard/health/ExcludedHealth.vue");
const HealthHomePage = () => import("../pages/dashboard/health/Home.vue");
// const NewHealthPage = () => import("../pages/dashboard/health/New.vue");
const ExistingHealthPage = () =>
  import("../pages/dashboard/health/ExistingHealth.vue");
const HealthHistoryPage = () => import("../pages/dashboard/health/History.vue");
// const HealthSettingsPage = () =>
//   import("../pages/dashboard/health/Settings.vue");

// pension
const ExcludedPensionPage = () =>
  import("../pages/dashboard/pension/ExcludedPension.vue");
const PensionHomePage = () => import("../pages/dashboard/pension/Home.vue");
const NewPensionPage = () => import("../pages/dashboard/pension/New.vue");
const ExistingPensionPage = () =>
  import("../pages/dashboard/pension/ExistingPension.vue");
const PensionHistoryPage = () =>
  import("../pages/dashboard/pension/History.vue");
const PensionSettingsPage = () =>
  import("../pages/dashboard/pension/Settings.vue");
const EditSalary = import(
  "../pages/dashboard/pension/pensionSettings/EditSalary.vue"
);
const DisablePension = import(
  "../pages/dashboard/pension/pensionSettings/DisablePension.vue"
);

// company settings
const PayrollHistory = () =>
  import("../pages/dashboard/companySettings/PayrollHistory.vue");
const EmployeesLogsPage = () =>
  import("../pages/dashboard/companySettings/EmployeesLogs.vue");
const CompanyInformationPage = () =>
  import("../pages/dashboard/companySettings/CompanyInformation.vue");
const ContactInformationPage = () =>
  import("../pages/dashboard/companySettings/ContactInformation.vue");
const DeleteCompanyPage = () =>
  import("../pages/dashboard/companySettings/DeleteCompany.vue");

// manage users
const AllUsersPage = () =>
  import("../pages/dashboard/manageUsers/AllUsers.vue");
const AccessManagementPage = () =>
  import("../pages/dashboard/manageUsers/AccessManagement.vue");
const EmployeePage = () =>
  import("../pages/dashboard/manageUsers/Employee.vue");
const ApproverAccessPage = () =>
  import("../pages/dashboard/manageUsers/ApproverAccess.vue");

// profile
const ProfilePage = () => import("../pages/dashboard/MyProfile.vue");

// profile
const SettingsPage = () => import("../pages/dashboard/Settings.vue");

// Tax & NHF
const DisableRemittance = () =>
  import("../pages/dashboard/tax/settings/DisableRemittance.vue");
const DownloadTaxData = () =>
  import("../pages/dashboard/tax/settings/DownloadTaxData.vue");
const EditStateBreakDown = () =>
  import("../pages/dashboard/tax/settings/EditStateBreakDown.vue");
const EmployeeTaxUpdate = () =>
  import("../pages/dashboard/tax/settings/EmployeeTaxUpdate.vue");
const TaxEnrolledEmployees = () =>
  import("../pages/dashboard/tax/TaxEnrolledEmployees.vue");
const TaxExcludedEmployees = () =>
  import("../pages/dashboard/tax/TaxExcludedEmployees.vue");
const TaxHistory = () => import("../pages/dashboard/tax/TaxHistory.vue");
const AddEmployeeTax = () =>
  import("../pages/dashboard/tax/AddEmployeeTax.vue");
const TaxHistoryId = () => import("../pages/dashboard/tax/TaxHistoryId.vue");

// wallet
const AccountsPage = () => import("../pages/dashboard/Wallet/Accounts.vue");
const TransactionsPage = () =>
  import("../pages/dashboard/Wallet/Transactions.vue");

const routes = [
  {
    path: "/:catchAll(.*)",
    component: NotFoundPage,
  },
  { path: "", redirect: "/login" },
  {
    path: "/login",
    component: AuthLayout,
    // redirect: '/signin',
    name: "auth",
    children: [
      {
        path: "",
        component: LoginPage,
        name: "auth.login",
        meta: { title: "Signin", public: true },
      },
      {
        path: "/signup",
        component: SignupPage,
        name: "auth.register",
        meta: { title: "Signup", public: true },
      },
      {
        path: "/forgotten",
        component: ForgottenPassword,
        name: "auth.forgotten",
        meta: { title: "Forgotten Password", public: true },
      },
      {
        path: "/change-password",
        component: ChangePassword,
        name: "auth.change",
        meta: { title: "Change Password", public: true },
      },
      {
        path: "/reset-password",
        component: ResetPassword,
        name: "auth.reset",
        meta: { title: "Reset Password", public: true },
        props: (route: { query: { email: any; token: any } }) => ({
          email: route.query.email,
          token: route.query.token,
        }),
      },
      {
        path: "/ConfirmEmail/Auth",
        component: ConfirmEmail,
        name: "auth.confirm",
        meta: { title: "Confirm Email", public: true },
        props: (route: { query: { email: any; token: any } }) => ({
          email: route.query.email,
          token: route.query.token,
        }),
      },
      {
        path: "/employee/register",
        component: RegisterEmployee,
        name: "auth.register-employee",
        meta: { title: "Register Employee", public: true },
        props: (route: { query: { id: any } }) => ({ id: route.query.id }),
      },
    ],
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardLayout,
    redirect: "/dashboard/home",
    children: [
      {
        path: "home",
        name: "dashboard.home",
        component: HomePage,
        meta: {
          noTopNav: true,
          title: "Dashboard - Home",
        },
      },
      {
        path: "mywallet",
        redirect: "/dashboard/mywallet/accounts",
        name: "dashboard.home.wallet",
        component: WalletLayout,
        children: [
          {
            path: "transactions",
            name: "dashboard.transactions",
            component: TransactionsPage,
            meta: {
              title: "Company - Transactions",
            },
          },

          {
            path: "accounts",
            name: "dashboard.accounts",
            component: AccountsPage,
            meta: {
              title: "Company - Accounts",
            },
          },
        ],
        meta: {
          title: "Wallets - Dashboard",
        },
      },
      {
        path: "companies",
        name: "dashboard.companies",
        component: CompaniesPage,
        meta: {
          title: "Companies - Dashboard",
        },
      },
      {
        path: "myprofile",
        name: "dashboard.myprofile",
        component: ProfilePage,
        meta: {
          title: "Profile - Dashboard",
        },
      },
      {
        path: "settings",
        name: "dashboard.settings",
        component: SettingsPage,
        meta: {
          title: "Settings - Dashboard",
        },
      },
      // {
      //   path: "employees",
      //   name: "dashboard.employees",
      //   component: EmployeeLayout,
      //   meta: {
      //     title: "Employees - Dashboard",
      //   },
      //   children: [
      //     {
      //       path: "",
      //       name: "dashboard.employees.all",
      //       component: EmployeesPage,
      //       meta: {
      //         title: "Employees - Dashboard",
      //         showEmployeeCards: true,
      //       },
      //     },
      //     {
      //       path: "pending",
      //       name: "dashboard.employees.pending",
      //       component: PendingEmployeePage,
      //       meta: {
      //         title: "Employees - Dashboard",
      //         showEmployeeCards: true,
      //       },
      //     },
      //     {
      //       path: "departments",
      //       name: "dashboard.employees.departments",
      //       component: EmployeeDepartmentPage,
      //       meta: {
      //         title: "Employees - Dashboard",
      //         showEmployeeCards: true,
      //       },
      //     },
      //     {
      //       path: "departments/:id",
      //       name: "dashboard.employees.departments.single",
      //       component: SingleDepartmentLayout,
      //       meta: {
      //         title: "Departments - Dashboard",
      //       },
      //       children: [
      //         {
      //           path: "",
      //           name: "dashboard.employees.departments.single.settings",
      //           component: DepartmentSettings,
      //         },
      //         {
      //           path: "settings",
      //           name: "dashboard.employees.departments.single.payroll-settings",
      //           component: DepartmentPayrollSettings,
      //         },
      //         {
      //           path: "employees",
      //           name: "dashboard.employees.departments.single.employees",
      //           component: DepartmentEmployees,
      //         },
      //       ],
      //     },
      //     {
      //       path: "companies-setting/:id",
      //       name: "dashboard.company.single",
      //       component: CompanySettingsLayout,
      //       meta: {
      //         title: " CompanySetting - Dashboard",
      //       },
      //     },
      //   ],
      // },
      {
        path: ":organisationId/view-employee/:employeeId",
        name: "dashboard.employees.single",
        component: ViewEmployeeLayout,
        meta: {
          title: "Employee - Profile - Dashboard",
        },
        children: [
          {
            path: "",
            name: "dashboard.employees.single.details",
            component: ViewEmployeeDetails,
          },
          {
            path: "salary-breakdown",
            name: "dashboard.employees.single.salary",
            component: ViewEmployeeSalaryBreakDown,
          },
          {
            path: "payroll-history",
            name: "dashboard.employees.single.payroll-history",
            component: ViewEmployeePayrollHistory,
          },
        ],
      },
      {
        path: "payroll",
        name: "dashboard.payroll",
        component: PayrollLayout,
        redirect: "/dashboard/payroll/history",
        children: [
          {
            path: "add-new",
            name: "dashboard.payroll.add",
            component: PayrollCreatePage,
            meta: {
              title: "Payroll - Create - Dashboard",
              showPayrollCards: true,
            },
          },
          {
            path: "confirm",
            name: "dashboard.payroll.confirm",
            component: ConfirmPayrollPage,
            meta: {
              title: "Payroll - Confirm",
            },
          },
          {
            path: "summary",
            name: "dashboard.payroll.summary",
            component: PayrollSummaryPage,
            meta: {
              title: "Payroll - Summary",
            },
          },
          {
            path: "settings",
            name: "dashboard.payroll.settings",
            component: PayrollSettingsPage,
            meta: {
              title: "Payroll - Settings -Dashboard",
            },
          },
          {
            path: "preview",
            name: "dashboard.payroll.preview",
            component: PreviewPayroll,
            meta: {
              title: "Payroll - Preview",
            },
          },
          {
            path: "approved/:payrollId",
            name: "dashboard.payroll.approved",
            component: PayrollApprovedPage,
            meta: {
              title: "Payroll - Approved",
            },
          },
          {
            path: "pending-approval/:payrollId",
            name: "dashboard.payroll.pending-approval",
            component: PendingApprovalPage,
            meta: {
              title: "Payroll - Pending",
            },
          },
          {
            path: "drafts",
            name: "dashboard.payroll.drafts",
            component: PayrollDraftPage,
            meta: {
              title: "Payroll - Drafts -  Dashboard",
              showPayrollCards: true,
            },
          },
          {
            path: "drafts-two",
            name: "dashboard.payroll.drafts.two",
            component: PayrollDraftTwoPage,
            meta: {
              title: "Payroll - Drafts - Two - Dashboard",
            },
          },
          {
            path: "history",
            name: "dashboard.payroll.history",
            component: PayrollHistoryPage,
            meta: {
              title: "Payroll - History - Dashboard",
              showPayrollCards: true,
            },
          },
          {
            path: "pending",
            name: "dashboard.payroll.pending",
            component: PendingPayrollPage,
            meta: {
              title: "Payroll - Pending - Dashboard",
              showPayrollCards: true,
            },
          },
        ],
      },
      {
        path: "pension",
        name: "dashboard.pension",
        component: PensionLayout,
        redirect: "/dashboard/pension/home",
        meta: {
          title: "Dashboard - Pension",
        },
        children: [
          {
            path: "home",
            name: "dashboard.pension.home",
            component: PensionHomePage,
            meta: {
              title: "Dashboard - Pension - home",
              hidePensionCards: true,
            },
          },
          {
            path: "add-new",
            name: "dashboard.pension.create",
            component: NewPensionPage,
            meta: {
              title: "Dashboard - Pension - create - new",
              hidePensionCards: true,
            },
          },
          {
            path: "existing",
            name: "dashboard.pension.existing",
            component: ExistingPensionPage,
            meta: {
              title: "Dashboard - Pension - create - existing",
            },
          },
          {
            path: "history",
            name: "dashboard.pension.history",
            component: PensionHistoryPage,
            meta: {
              title: "Dashboard - Pension - history",
            },
          },
          {
            path: "settings",
            name: "dashboard.pension.settings",
            component: PensionSettingsPage,
            redirect: "/dashboard/pension/settings/edit-salary",
            children: [
              {
                path: "edit-salary",
                name: "dashboard.pension.settings.edit-salary",
                component: EditSalary,
              },
              {
                path: "disable-pension",
                name: "dashboard.pension.settings.disable-pension",
                component: DisablePension,
              },
            ],
            meta: {
              title: "Dashboard - Pension - setting",
              hidePensionCards: true,
            },
          },
          {
            path: "excluded",
            name: "dashboard.pension.excluded",
            component: ExcludedPensionPage,
            meta: {
              title: "Dashboard - Pension - excluded",
            },
          },
        ],
      },
      {
        path: "health",
        name: "dashboard.health",
        component: HealthLayout,
        redirect: "/dashboard/health/home",
        meta: {
          title: "Dashboard - Health",
        },
        children: [
          {
            path: "home",
            name: "dashboard.pension.health",
            component: HealthHomePage,
            meta: {
              title: "Dashboard - Health - home",
              hidePensionCards: true,
            },
          },
          // {
          //   path: "add-new",
          //   name: "dashboard.pension.create",
          //   component: NewPensionPage,
          //   meta: {
          //     title: "Dashboard - Pension - create - new",
          //     hidePensionCards: true,
          //   },
          // },
          {
            path: "existing",
            name: "dashboard.health.existing",
            component: ExistingHealthPage,
            meta: {
              title: "Dashboard - Health - create - existing",
            },
          },
          {
            path: "history",
            name: "dashboard.health.history",
            component: HealthHistoryPage,
            meta: {
              title: "Dashboard - Health - history",
            },
          },
          // {
          //   path: "settings",
          //   name: "dashboard.pension.settings",
          //   component: PensionSettingsPage,
          //   redirect: "/dashboard/pension/settings/edit-salary",
          //   children: [
          //     {
          //       path: "edit-salary",
          //       name: "dashboard.pension.settings.edit-salary",
          //       component: EditSalary,
          //     },
          //     {
          //       path: "disable-pension",
          //       name: "dashboard.pension.settings.disable-pension",
          //       component: DisablePension,
          //     },
          //   ],
          //   meta: {
          //     title: "Dashboard - Pension - setting",
          //     hidePensionCards: true,
          //   },
          // },
          {
            path: "excluded",
            name: "dashboard.health.excluded",
            component: ExcludedHealthPage,
            meta: {
              title: "Dashboard - Health - excluded",
            },
          },
        ],
      },
      {
        path: "company-settings/:id",
        name: "dashboard.company.settings",
        component: CompanySettingsLayout,
        redirect: "/dashboard/company-settings/:id/company-information",
        children: [
          {
            path: "company-information",
            name: "dashboard.company.settings.information",
            component: CompanyInformationPage,
            meta: {
              title: "Company - Settings - Contact - Dashboard",
            },
          },
          {
            path: "contact-information",
            name: "dashboard.company.settings.contact",
            component: ContactInformationPage,
            meta: {
              title: "Company - Settings - Contact - Dashboard",
            },
          },
          {
            path: "payroll-history",
            name: "dashboard.company.settings.payroll-history",
            component: PayrollHistory,
            meta: {
              title: "Company - Settings - Payroll History - Dashboard",
            },
          },
          {
            path: "employees-logs",
            name: "dashboard.company.settings.employees-logs",
            component: EmployeesLogsPage,
            meta: {
              title: "Company - Settings - Employees Logs - Dashboard",
            },
          },
          {
            path: "delete",
            name: "dashboard.company.settings.delete-company",
            component: DeleteCompanyPage,
            meta: {
              title: "Company - Settings - Delete - Dashboard",
            },
          },
        ],
      },
      {
        path: "manage-users",
        name: "dashboard.manage.users",
        component: ManageUsersLayout,
        redirect: "/dashboard/manage-users/all-users",
        children: [
          {
            path: "all-users",
            name: "dashboard.manage.users.all-users",
            component: AllUsersPage,
            meta: {
              title: "Company - Manage - Users - Dashboard",
            },
          },
          {
            path: "access-management",
            name: "dashboard.manage.users.access.management",
            component: AccessManagementPage,
            meta: {
              title: "Company - Manage - Access - Dashboard",
            },
          },
        ],
      },
      {
        path: "manage-permission",
        name: "dashboard.manage.permission",
        component: ManageAdminPermissionLayout,
        redirect: "/dashboard/manage-permission/employee",
        children: [
          {
            path: "employee",
            name: "dashboard.manage.permission.employee",
            component: EmployeePage,
            meta: {
              title: "Company - Manage - Employee - Dashboard",
            },
          },
        ],
      },
      {
        path: "tax-compliance",
        name: "dashboard.tax-compliance",
        component: TaxLayout,
        meta: {
          title: "Tax - Dashboard",
        },
        children: [
          {
            path: "",
            name: "dashboard.tax-compliance.enrolled-employees",
            component: TaxEnrolledEmployees,
            meta: {
              showTaxCards: true,
            },
          },
          {
            path: "tax-history",
            name: "dashboard.tax-compliance.tax-history",
            component: TaxExcludedEmployees,
            meta: {
              showTaxCards: true,
            },
          },
          {
            path: "history",
            name: "dashboard.tax-compliance.history",
            component: TaxHistory,
            meta: {
              showTaxCards: true,
            },
          },
          // {
          //   path: "tax-history",
          //   name: "dashboard.tax-compliance.tax-history",
          //   component: TaxHistoryId,
          //   meta: {
          //     title: "tax - TaxHistoryId",
          //     showTaxCards: true,
          //   },
          // },
          {
            path: "add-employee",
            name: "dashboard.tax-compliance.add-employee",
            component: AddEmployeeTax,
          },
          {
            path: "settings",
            name: "dashboard.tax-compliance.settings",
            redirect:
              "/dashboard/tax-compliance/settings/edit-state-break-down",
            component: TaxSettingsLayout,
            children: [
              {
                path: "edit-state-break-down",
                name: "dashboard.tax-compliance.settings.edit-state-break-down",
                component: EditStateBreakDown,
              },
              {
                path: "disable-remittance",
                name: "dashboard.tax-compliance.settings.disable-remittance",
                component: DisableRemittance,
              },
              {
                path: "download-tax-data",
                name: "dashboard.tax-compliance.settings.download-data",
                component: DownloadTaxData,
              },
              {
                path: "update-employee-tax",
                name: "dashboard.tax-compliance.settings.update-employee-tax",
                component: EmployeeTaxUpdate,
              },
            ],
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return { top: 0 };
      // return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const metaTitle = to.matched
    .slice()
    .reverse()
    .find((route) => route.meta && route.meta.title);
  // If a route with a title was found, set the document (page) title to that value.
  if (metaTitle) document.title = metaTitle.meta.title + " | Platoon";
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (to.name) {
    window.NProgress.start();
    window.NProgress.set(0.2);
  }

  // //redirect to login page if not logged in and trying to access a restricted page
  // const publicPages = ["/signin", "/signup"];
  // const authRequired = !publicPages.includes(to.path);
  // const loggedIn = isAuthenticated();
  // if (authRequired && !loggedIn) {
  //   return next("/login");
  // }

  // router guard
  if (to.meta && to.meta.public) {
    return next();
  } else {
    const isLoggedIn = isAuthenticated();
    if (isLoggedIn == true) {
      return next();
    } else {
      return next("/signin");
    }
  }
});

router.afterEach(() => {
  window.NProgress.set(0.7);
  setTimeout(() => window.NProgress.done(), 400);
});

const isActiveRoute = (routeName: string): boolean =>
  useRoute().name!.toString().includes(routeName);

export { router, isActiveRoute };

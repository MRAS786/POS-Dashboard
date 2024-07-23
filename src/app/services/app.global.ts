export class AppGlobal {
    public readonly TOKEN_AUTH = "/api/Token/Auth";
    public readonly SAVE_EMPLOYEE = "/Master/saveUser";
    public readonly GET_EMPLOYEES = "/Master/getEmployees";
    public readonly GET_LOCATIONS = "/Master/getLocations";
    public readonly ASSIGN_LOCATIONS = "/Master/assignLocations";
    public readonly GET_ASSIGN_LOCATIONS_BY_ID = "/Master/getAssignedLocations?userID=";

    public readonly GET_CATEGORY = "/Master/getCategory";
    public readonly SAVE_CATEGORY = "/Master/saveCategory";

    public readonly SAVE_SUB_CATEGORY = "/Master/savesubCategory";
    public readonly GET_SUB_CATEGORY_BY_ID = "/Master/getSubCategory?categoryID=";

    public readonly GET_SALE_DATE_WISE = "/Master/getsaleDateWise";
    public readonly GET_ASSIGNED_LOCATIONS = "/Master/getAssignedLocations";
    public readonly GET_DATE_WISE_DETAILS = "/Dashboard/getDateWiseDetail";
    public readonly GET_RECIPT_DETAILS_INVOICE = "/Dashboard/getReciptDetail";

    public readonly GET_FOOD_WISE_REPORT = "/Master/getFoodWiseReport";
    public readonly GET_HOURY_WISE_REPORT = "/Dashboard/gethoulyData";
    public readonly GET_HOURY_NOP_WISE_REPORT = "/Dashboard/gethoulyDataNOP";
    public readonly GET_DETAIL_REPORT = "/Dashboard/gethoulyDataNOP_Detail";
    public readonly GET_HOURLY_REPORT = "/Dashboard/gethoulyData_Detail";

    public readonly GET_CATEGORY_WISE_DATA = "/Dashboard/getCategorywiseData";
    public readonly GET_PAYMENT_MODE_DATA = "/Dashboard/getpaymentModeData";
    public readonly GET_PAYMENT_MODE_DATA_COMBINE = "/Dashboard/getpayLocationwise";

    public readonly GET_DASHBOARD_DATA = "/Dashboard/getdashboardData";

    public readonly ITEM_WISE_REPORT = "/Master/itemwiseReport";

    public readonly MONTHALY_SALES_BY_LOCATION = "/Dashboard/monthlySale?locationID=";
    public readonly DAILY_SALES_BY_LOCATION = "/Dashboard/dailySale?locationID=";

    public readonly GET_CATEGORY_LIST = "/Master/categorList";

    public readonly GET_ITEM_LIST = "/Master/itemList";
    public readonly GET_SALES_LOCATION_WISE = "/Dashboard/getsalelocationWise";

    public readonly GET_SALES_DETAILS = "/Dashboard/saleDetail";

    //New Daily Sales API
    public readonly GET_SALES_DAILY_DETAILS = "/Dashboard/getsaleDailyWise";
    public readonly GET_SALES_MONTHLY_DETAILS = "/Dashboard/getsaleMonthWise";
    public readonly GET_SALES_YEAR_DETAILS = "/Dashboard/getsaleYearWise";
    public readonly GET_ALL_LOCATION_DETAILS = "/Dashboard/getsaleLocationWise_Total";

    public readonly GET_DAILY_CATEGORY_WISE_DETAILS = "/Master/getDayCatWiseSales_Report";
    public readonly GET_MONTHLY_CATEGORY_WISE_DETAILS = "/Master/getMonthCatWiseSales_Report";
    public readonly GET_YEARLY_CATEGORY_WISE_DETAILS = "/Master/getYearCatWiseSales_Report";
    public readonly GET_DAILY_COST_DETAILS = "/Master/getDayCatWiseCost_Report";
    public readonly GET_SALES_COST_DETAILS = "/Master/getDayCatWiseSalesCost_Report";


    //IT Users
    public readonly SAVE_LOCATIONS = "/Master/saveLocation";
    public readonly GET_LOCATIONS_ALL = "/Master/getLocationsALL";
    public readonly GET_USER_INFO = "/Master/getuserInfo?empID=";
    

    //Payment Mode
    public readonly GET_PAYMENT_MODE = "/Master/GetModePayments?locID=";
    public readonly GET_SPECIFIC_DAYS = "/Dashboard/getSpecificDaysSale  ";

    //Dynamic Menu
    public readonly GET_PARENT_MENU = "/Master/getParentMenu";
    public readonly GET_ALL_MENU = "/Master/getAllMenu";
    public readonly SAVE_MENU = "/Master/saveMenu";

    //Group Roles
    public readonly SAVE_GROUP = "/Master/saveGroup";
    public readonly GET_GROUP = "/Master/GetGroup";
    public readonly GET_GROUP_ROLES = "/Master/getgroupRoles?groupid=";
}
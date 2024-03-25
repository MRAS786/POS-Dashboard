export class AppGlobal {
    public readonly TOKEN_AUTH = "/api/Token/Auth";
    public readonly SAVE_EMPLOYEE = "/Master/saveEmployee";
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
    public readonly GET_DATE_WISE_DETAILS = "/Master/getDateWiseDetail";
    public readonly GET_RECIPT_DETAILS_INVOICE = "/Master/getReciptDetail";

    public readonly GET_FOOD_WISE_REPORT = "/Master/getFoodWiseReport";
    public readonly GET_HOURY_WISE_REPORT = "/Master/gethoulyData";
    // public readonly GET_HOURY_NOP_WISE_REPORT = "/Master/gethoulyDataNOP";
    public readonly GET_HOURY_NOP_WISE_REPORT = "/Master/gethoulyDataNOP";
    public readonly GET_DETAIL_REPORT = "/Master/gethoulyDataNOP_Detail";
    public readonly GET_HOURLY_REPORT = "/Master/gethoulyData_Detail";

    public readonly GET_CATEGORY_WISE_DATA = "/Master/getCategorywiseData";

    public readonly GET_DASHBOARD_DATA = "/Master/getdashboardData?userid=";

    public readonly ITEM_WISE_REPORT = "/Master/itemwiseReport";

    public readonly MONTHALY_SALES_BY_LOCATION = "/Master/monthlySale?locationID=";
    public readonly DAILY_SALES_BY_LOCATION = "/Master/dailySale?locationID=";

    public readonly GET_CATEGORY_LIST = "/Master/categorList";

    public readonly GET_ITEM_LIST = "/Master/itemList";
    public readonly GET_SALES_LOCATION_WISE = "/Master/getsalelocationWise";

    public readonly GET_SALES_DETAILS = "/Master/saleDetail";

    //New Daily Sales API
    public readonly GET_SALES_DAILY_DETAILS = "/Master/getsaleDailyWise";
    public readonly GET_SALES_MONTHLY_DETAILS = "/Master/getsaleMonthWise";
    public readonly GET_SALES_YEAR_DETAILS = "/Master/getsaleYearWise";
    public readonly GET_ALL_LOCATION_DETAILS = "/Master/getsaleLocationWise_Total";

    public readonly GET_DAILY_CATEGORY_WISE_DETAILS = "/Master/getDayCatWiseSales_Report";
    public readonly GET_MONTHLY_CATEGORY_WISE_DETAILS = "/Master/getMonthCatWiseSales_Report";
    public readonly GET_YEARLY_CATEGORY_WISE_DETAILS = "/Master/getYearCatWiseSales_Report";
    public readonly GET_DAILY_COST_DETAILS = "/Master/getDayCatWiseCost_Report";
    public readonly GET_SALES_COST_DETAILS = "/Master/getDayCatWiseSalesCost_Report";


    //IT Users
    public readonly SAVE_LOCATIONS = "/Master/saveLocation";
    public readonly GET_LOCATIONS_ALL = "/Master/getLocationsALL";

    //Payment Mode
    public readonly GET_PAYMENT_MODE = "/POS/GetModePayments?locID=";
    public readonly GET_SPECIFIC_DAYS = "/Master/getSpecificDaysSale  ";
}
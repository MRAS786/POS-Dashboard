export class AppGlobal {
    public readonly TOKEN_AUTH = "/api/Token/Auth";
    public readonly SAVE_EMPLOYEE = "/Master/saveEmployee";
    public readonly GET_EMPLOYEES = "/Master/getEmployees";
    public readonly GET_LOCATIONS = "/Master/getLocations";
    public readonly ASSIGN_LOCATIONS = "/Master/assignLocations";
    public readonly GET_ASSIGN_LOCATIONS_BY_ID= "/Master/getAssignedLocations?userID=";

    public readonly GET_CATEGORY = "/Master/getCategory";
    public readonly SAVE_CATEGORY = "/Master/saveCategory";

    public readonly SAVE_SUB_CATEGORY = "/Master/savesubCategory";
    public readonly GET_SUB_CATEGORY_BY_ID = "/Master/getSubCategory?categoryID=";

    public readonly GET_SALE_DATE_WISE = "/Master/getsaleDateWise";
    public readonly GET_ASSIGNED_LOCATIONS = "/Master/getAssignedLocations";
    public readonly GET_DATE_WISE_DETAILS = "/Master/getsaleDateWiseDetail";
    public readonly GET_RECIPT_DETAILS_INVOICE = "/Master/getReciptDetail?invoiceno=";
}
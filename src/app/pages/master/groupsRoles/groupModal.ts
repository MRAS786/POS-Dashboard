export class requestGroup {
    GroupId: number;
    GroupName: string;
    UserID: string;
    vuserMenu: vuserMenu;
    constructor() {
        this.vuserMenu = new vuserMenu;
    }
}
export class vuserMenu {
    accessId: number;
    menuID: number;
    groupid: number;
    menuName: string;
    canDelete: boolean;
    canView: boolean;
    canEdit: boolean;
    canAdd: boolean;
}
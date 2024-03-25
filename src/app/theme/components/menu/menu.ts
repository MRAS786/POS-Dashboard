import { Menu } from './menu.model';

export const verticalMenuItems = [
    new Menu(1, 'Dashboard', '/view/dashboard', null, 'tachometer', null, false, 0),
    new Menu(5, 'Sales', '/view/dailysales', null, 'calendar', null, false, 0),
    //new Menu(6, 'Category Wise Data', '/view/foodsales', null, 'calendar', null, false, 0),
    // new Menu(7, 'Timeslot Wise Sales', '/view/timeslotsales', null, 'calendar', null, false, 0),
    // new Menu(8, 'Timeslot Wise Sales (NOP)', '/view/timeslotnopsales', null, 'calendar', null, false, 0),
    // new Menu (9, 'Items Wise Report', '/view/itemsreport', null, 'calendar', null, false, 0),

    // new Menu (2, 'Master', null, null, 'sitemap', null, true, 0),
    // new Menu (3, 'Users', '/view/master/users', null, 'users', null, false, 2),
    // new Menu (4, 'Category', '/view/master/category', null, 'cubes', null, false, 2),

    new Menu(10, 'Locations', '/view/itusers', null, 'globe', null, false, 0),

]

export const horizontalMenuItems = [
    new Menu(1, 'Dashboard', '/view/dashboard', null, 'tachometer', null, false, 0),
    new Menu(5, 'Sales', '/view/dailysales', null, 'calendar', null, false, 0),
    // new Menu (6, 'Category Wise Data', '/view/foodsales', null, 'calendar', null, false, 0),
    // new Menu(7, 'Timeslot Wise Sales', '/view/timeslotsales', null, 'calendar', null, false, 0),
    // new Menu(8, 'Timeslot Wise Sales (NOP)', '/view/timeslotnopsales', null, 'calendar', null, false, 0),
    // new Menu (9, 'Items Wise Report', '/view/itemsreport', null, 'calendar', null, false, 0),

    // new Menu (2, 'Master', null, null, 'sitemap', null, true, 0),
    // new Menu (3, 'Users', '/view/master/users', null, 'users', null, false, 2),
    // new Menu (4, 'Category', '/view/master/category', null, 'cubes', null, false, 2),

    new Menu(10, 'Locations', '/view/itusers', null, 'globe', null, false, 0),

]
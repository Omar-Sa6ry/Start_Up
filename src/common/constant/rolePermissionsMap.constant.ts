import { Permission, Role } from './enum.constant';

export const rolePermissionsMap: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    // User
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    Permission.EDIT_USER_ROLE,
    Permission.RESET_PASSWORD,
    Permission.CHANGE_PASSWORD,
    Permission.FORGOT_PASSWORD,
    Permission.LOGOUT,
    Permission.VIEW_USER,

    // Category
    Permission.CREATE_CATEGORY,
    Permission.UPDATE_CATEGORY,
    Permission.DELETE_CATEGORY,

    // Cart
    Permission.CREATE_CART,
    Permission.UPDATE_CART,
    Permission.DELETE_CART,
    Permission.VIEW_CART,
  ],

  [Role.USER]: [
    // User
    Permission.UPDATE_USER,
    Permission.RESET_PASSWORD,
    Permission.CHANGE_PASSWORD,
    Permission.FORGOT_PASSWORD,
    Permission.LOGOUT,

    // Cart
    Permission.CREATE_CART,
    Permission.UPDATE_CART,
    Permission.DELETE_CART,
    Permission.VIEW_CART,
  ],
};

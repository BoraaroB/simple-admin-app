export const sessionService = {
  /**
 * Stores user json object ot local storage
 * @param user
 */
  create(user) {
      localStorage.setItem('simpleAdminApp', JSON.stringify(user));
  },
  /**
 * Destroy user object from local storage and redirects to login
 */
  destroy() {
      localStorage.removeItem('simpleAdminApp');
  },
  /**
   * get user from the local storage
   */
  getUser() {
      const data = localStorage.getItem('simpleAdminApp');
      if (!data) return null;
      const user = JSON.parse(data);
      if (user) return user.user;
      return null;
  },
  /**
   * get access token from the local storage
   */
  getSessionToken() {
      const data = localStorage.getItem('simpleAdminApp');
      if (!data) return null;
      const session = JSON.parse(data);
      return (session && session.token) ? session.token : null;
  },
  /**
   * check is the user admin
   */
  isAdmin() {
      const data = localStorage.getItem('simpleAdminApp');
      if (!data) return false;
      const { user } = JSON.parse(data);
      return !!(user && user.role && user.role === 1);
  },
  /**
   * check is the user Manager
   */
  isManager() {
    const data = localStorage.getItem('simpleAdminApp');
    if (!data) return false;
    const { user } = JSON.parse(data);
    return !!(user && user.role && user.role === 2);
  },
  isAuth() {
      const data = localStorage.getItem('simpleAdminApp');
      if (!data) {
          return false;
      } else {
          const session = JSON.parse(data);
          return session.token;
      }
  }
};

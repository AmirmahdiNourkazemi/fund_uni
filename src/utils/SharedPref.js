export const getForceUpdateDate = async () => {
    return localStorage.getItem('forceUpdateDate');
  };
  
  export const setForceUpdateDate = async (date) => {
    localStorage.setItem('forceUpdateDate', date);
  };
  
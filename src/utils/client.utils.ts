export const getIsRedirectToClient = (url: string) => {
  const urlArray = url.split('/');
  if (urlArray.includes('api')) {
    return false;
  }
  if (urlArray.includes('client')) return false;
  return true;
};

export const getIsAssetsRequest = (url: string) => {
  return url.split('/').includes('assets');
};

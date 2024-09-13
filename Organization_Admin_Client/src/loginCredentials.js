// loginCredentials.js
export const getLoginCredentials = async () => {
    const response = await fetch( `${baseApiUrl}/loginusername`); 
    const data = await response.json();
    return { 
      organization_name: data.organization_name 
    };
  };
  
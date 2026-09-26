(function attachAuthCore(root) {
  const localRedirectUri = "http://localhost:8000/";
  const productionRedirectUri = "https://main.d39wc75md4exup.amplifyapp.com/";

  function getCognitoRedirectUri(locationValue = {}) {
    const hostname = String(locationValue.hostname || "").toLocaleLowerCase();
    return ["localhost", "127.0.0.1"].includes(hostname)
      ? localRedirectUri
      : productionRedirectUri;
  }

  root.OghamAuthCore = {
    getCognitoRedirectUri,
    localRedirectUri,
    productionRedirectUri
  };
})(window);

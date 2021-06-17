const newPathname = window.location.pathname.split("/").filter(Boolean)[0];
window.location.pathname = `/${newPathname}/`;

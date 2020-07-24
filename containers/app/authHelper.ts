export const getLocalID = (pathname: string) => {
    const maybeLocalID = pathname.match(/\/\d{0,6}\//);
    if (!maybeLocalID) {
        return;
    }
    const localID = parseInt(maybeLocalID[1], 10);
    if (!Number.isInteger(localID)) {
        return;
    }
    return localID;
};


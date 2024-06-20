const testLocal = {
    SERVER_URL: "http://localhost:8189",
    COMPANY_NAME: "Be Happy",
    COMPANY_LOGO:
        "https://login.mytravellerschoice.com/assets/logo-2c140806.png",
};

const testLive = {
    SERVER_URL: "https://dev.mytravellerschoice.com",
    COMPANY_NAME: "Be Happy",
    COMPANY_LOGO:
        "https://login.mytravellerschoice.com/assets/logo-2c140806.png",
};

const devLocal = {
    SERVER_URL: "http://localhost:8089",
    COMPANY_NAME: "Be Happy",
    COMPANY_LOGO:
        "https://login.mytravellerschoice.com/assets/logo-2c140806.png",
};

const devLive = {
    SERVER_URL: "https://api-server-i.behappytourism.com",
    COMPANY_NAME: "Be Happy",
    COMPANY_LOGO:
        "https://res.cloudinary.com/duuidrhyl/image/upload/v1705058334/Website/logo/unpb5sdovoeysv98fnnk.png",
};

export const config =
    import.meta.env.VITE_NODE_ENV === "PROD_LIVE"
        ? devLive
        : import.meta.env.VITE_NODE_ENV === "PROD_LOCAL"
        ? devLocal
        : import.meta.env.VITE_NODE_ENV === "TEST_LIVE"
        ? testLive
        : testLocal;
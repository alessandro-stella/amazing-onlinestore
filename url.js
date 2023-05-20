const isDeveloping = process.env.NODE_ENV == "development";

export const url = isDeveloping
    ? "http://localhost:5000"
    : "https://amazing-onlinestore.herokuapp.com";

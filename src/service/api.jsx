import axios from "axios";
export const api=
    axios
    .create({
        baseURL:"https://veloceapi.onrender.com",
        headers:{"Content-Type":"application/json"}

    });



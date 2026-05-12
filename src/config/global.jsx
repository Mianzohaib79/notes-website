import { message } from "antd";

window.getRandomId = () => Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

window.isValidEmail = email => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)

window.toastify = (msg, type) => message[type](msg)

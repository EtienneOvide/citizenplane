import axios from 'axios'

const api = axios.create({
  /* TODO:  baseURL: place your API base URL here , */
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    /* TODO: place your Authorization header here eg, 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', */
  },
})

export default api

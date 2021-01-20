export const config = {
      "dev": {
           "username": "root",
           "password": "root@123",
           "database": "salesDb",
           "host": "127.0.0.1",
      },
     "prod": {
           "username": process.env.DB_USERNAME,
           "password": process.env.DB_PASSWORD,
           "database": process.env.DB_NAME,
           "host": process.env.DB_ENDPOINT,
     } 
}
  
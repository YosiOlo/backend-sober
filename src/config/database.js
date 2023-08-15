module.exports={
  "development": {
    "username": "postgres",
    "password": "",
    "database": "sobermart",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    use_env_variable: 'db_url',
    dialect: "mysql",
    protocol: "mysql",
    dialectOptions: {
      ssl : {
        require : true,
        rejectUnauthorized : false
      }
    }
  }
}

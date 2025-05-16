"use strict";
const bcrypt = require("bcryptjs");
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await queryInterface.bulkInsert("user", [
      {
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user", null, {});
  },
};

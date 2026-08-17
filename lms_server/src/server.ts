/* eslint-disable no-console */
import app from "./app";
import config from "./app/config";
import prisma from "./app/util/prisma";

async function Main() {
  try {
    await prisma.$connect();
    app.listen(config.port, () => {
      console.log(`listening from port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

Main();

import getConfig from "next/config"; // config allows us to change values of env variables, and also allows components to use our env variables, as with APP_NAME

const { publicRuntimeConfig } = getConfig(); // allow us to access variables we wrote in the next.config.js file

export const API = publicRuntimeConfig.PRODUCTION
  ? publicRuntimeConfig.API_PRODUCTION
  : publicRuntimeConfig.API_DEVELOPMENT;

export const APP_NAME = publicRuntimeConfig.APP_NAME;

export const DOMAIN = publicRuntimeConfig.PRODUCTION
  ? publicRuntimeConfig.DOMAIN_DEVELOPMENT
  : publicRuntimeConfig.DOMAIN_PRODUCTION;

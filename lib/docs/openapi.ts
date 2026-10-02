import { createOpenAPI } from 'fumadocs-openapi/server';

export const openapi = createOpenAPI({
  input: [
    './content/openapi/external-api.en.json',
    './content/openapi/external-api.pl.json',
  ],
});

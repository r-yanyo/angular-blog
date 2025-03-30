export const environment = {
  production: false,
  contentful: {
    spaceId: process.env['CONTENTFUL_SPACE_ID'] || '',
    accessToken: process.env['CONTENTFUL_ACCESS_TOKEN'] || ''
  }
};

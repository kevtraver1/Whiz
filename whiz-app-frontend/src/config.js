export default {
    MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
      REGION: "us-east-1",
      BUCKET: "whiz-app-uploads"
    },
    list_api_gateway: {
      REGION: "us-east-1",
      URL: "https://mk6od1eccb.execute-api.us-east-1.amazonaws.com/list"
    },
    create_api_gateway: {
      REGION: "us-east-1",
      URL: "https://wdi41mc2z1.execute-api.us-east-1.amazonaws.com/create/"
    },
    app_api_gateway: {
      REGION: "us-east-1",
      URL: "https://uv63c3dai7.execute-api.us-east-1.amazonaws.com/app"
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_tdd3MGwY1",
      APP_CLIENT_ID: "70qr61gkgp29isr37cjgu1j1s1",
      IDENTITY_POOL_ID: "us-east-1:c066342f-27db-485c-8838-fa70c8f4d9d3"
    }
  };
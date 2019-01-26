export default {
    MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
      REGION: "us-east-1",
      BUCKET: "whiz-app-uploads"
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://9n980grtv6.execute-api.us-east-1.amazonaws.com/"
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_9PgJGp5T8",
      APP_CLIENT_ID: "78hq54l5qju44oqus9hhh938sj",
      IDENTITY_POOL_ID: "us-east-1:80d447bf-efd0-41cf-9323-2682ecb92938"
    }
  };
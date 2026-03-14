type ApiErrorCode =
  | "BAD_REQUEST"
  | "FORBIDDEN"
  | "UPSTREAM_ERROR"
  | "INTERNAL_ERROR";

export const createApiErrorResponse = (
  status: number,
  code: ApiErrorCode,
  message: string,
) => {
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        code,
        message,
      },
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    },
  );
};

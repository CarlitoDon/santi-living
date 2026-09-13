interface TrackingEnvironment {
  [key: string]: string | undefined;
  VERCEL_ENV?: string;
  NEXT_PUBLIC_ENABLE_MARKETING_TRACKING?: string;
}

export function shouldLoadTracking(environment: TrackingEnvironment = process.env): boolean {
  return environment.VERCEL_ENV === 'production' || (
    environment.VERCEL_ENV !== 'preview' &&
    environment.NEXT_PUBLIC_ENABLE_MARKETING_TRACKING === 'true'
  );
}

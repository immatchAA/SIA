import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    apiVersion: '1.0',
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-sa-redweb-production.up.railway.app',
    environment: process.env.NODE_ENV || 'development',
    features: {
      bloodRequests: true,
      notifications: true,
      userProfiles: true
    }
  };

  return NextResponse.json(config);
}

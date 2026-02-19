'use client';

import { useEffect } from "react";
import { sendMetrics } from "./sendMetrics";

export default function Metrics({ locale }: { locale: string }) {
  useEffect(() => {
    sendMetrics(locale)
    .catch(() => {
      // Silently fail if metrics cannot be sent
    });
  }, [locale]);
  
  return null;
}
'use client';

import { useEffect } from "react";
import { sendMetrics } from "./sendMetrics";

export default function Metrics({ locale }: { locale: string }) {
  useEffect(() => {
    sendMetrics(locale);
  }, [locale]);
  
  return null;
}
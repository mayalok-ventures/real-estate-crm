"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Icon } from "./Icon";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

export function PwaRegister() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    // Register Service Worker for offline application shell caching
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SAHYAK PWA ServiceWorker registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.warn("ServiceWorker registration failed:", error);
        });
    }
  }, []);

  return (
    <div
      className={`network-pill ${isOnline ? "online" : "offline"}`}
      title={isOnline ? "Connected to network" : "Offline mode: serving cached application shell"}
      aria-label={isOnline ? "Online" : "Offline"}
    >
      <Icon name={isOnline ? "wifi" : "wifi-off"} size={13} />
      <span>{isOnline ? "Online" : "Offline"}</span>
    </div>
  );
}

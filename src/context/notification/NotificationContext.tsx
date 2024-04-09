import React, { ReactNode, useState } from "react";

export interface Notification {
  message: ReactNode;
}

type NotificationProviderProps = {
  children: React.ReactNode;
};

type NotificationContextState = {
  notification: Notification | undefined;
  setNotification: (notification: Notification | undefined) => void;
};

export const NotificationContext = React.createContext<
  NotificationContextState | undefined
>(undefined);

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [notification, setNotification] = useState<Notification | undefined>(
    undefined
  );
  return (
    <NotificationContext.Provider
      value={{
        notification,
        setNotification: (notification) => setNotification(notification),
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error(
      `useNotifications must be used within a NotificationProvider`
    );
  }
  return context;
};

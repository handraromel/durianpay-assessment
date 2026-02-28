import { AppLoading } from "@/components";
import { NotificationProvider, ReactQueryProvider } from "@/providers";
import { AppRouter } from "@/routers/AppRouter";

export default function App() {
  return (
    <ReactQueryProvider>
      <NotificationProvider>
        <AppLoading />
        <AppRouter />
      </NotificationProvider>
    </ReactQueryProvider>
  );
}

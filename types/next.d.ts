import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

declare module "next/navigation" {
  interface RouterEvents {
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback: (...args: any[]) => void): void;
    emit(event: string): void;
  }

  interface ExtendedAppRouterInstance extends AppRouterInstance {
    events?: RouterEvents;
  }

  // Override the useRouter return type
  function useRouter(): ExtendedAppRouterInstance;
}

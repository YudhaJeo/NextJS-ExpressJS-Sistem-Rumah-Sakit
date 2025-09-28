declare global {
  interface Window {
    qz?: {
      printers: {
        find: () => Promise<string[]>;
      };
      configs: {
        create: (printerName: string) => any;
      };
      websocket: {
        connect: () => Promise<void>;
        disconnect?: () => Promise<void>;
      };
    };
  }
}

export {};

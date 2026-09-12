declare global {
  namespace Express {
    interface Request {
      studentSession?: { role: "student"; id: number } | null;
      adminSession?: { role: "admin"; id: number } | null;
    }
  }
}

export {};

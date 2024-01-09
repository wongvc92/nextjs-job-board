//code from clerk docs

import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({});

export const config = {
  matcher: ["/(admin)(.*)"],
};

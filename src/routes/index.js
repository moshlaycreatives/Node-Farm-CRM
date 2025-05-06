import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { productRouter } from "./product.routes.js";
import { paymentRouter } from "./payment.routes.js";
import { whitneyBlockRouter } from "./whitneyBlock.routes.js";
import { loginAuth } from "../middlewares/loginAuth.middleware.js";
import { cartRouter } from "./cart.routes.js";
import { labTestRouter } from "./labTest.routes.js";
import { orderRouter } from "./order.routes.js";
import { contactUsRouter } from "./contactUs.routes.js";
import { dashboardRouter } from "./dashboard.routes.js";

const router = Router();

// ==============================================
// 1. User Routes
// ==============================================
router.use("/user", authRouter);

// ==============================================
// 2. Product Routes
// ==============================================
router.use("/product", productRouter);

// ==============================================
// 3. Payment Routes
// ==============================================
router.use("/payment", paymentRouter);

// ==============================================
// 4. Whitney Block Routes
// ==============================================
router.use("/whitney-block", whitneyBlockRouter);

// ==============================================
// 5. Cart Routes
// ==============================================
router.use("/cart", loginAuth, cartRouter);

// ==============================================
// 6. Cart Routes
// ==============================================
router.use("/labtest", labTestRouter);

// ==============================================
// 7. Order Routes
// ==============================================
router.use("/order", orderRouter);

// ==============================================
// 8. Contact Us Routes
// ==============================================
router.use("/contact-us", contactUsRouter);

// ==============================================
// 9. Dashboard Routes
// ==============================================
router.use("/dashboard", dashboardRouter);

export { router };

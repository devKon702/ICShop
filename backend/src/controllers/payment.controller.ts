import { Request, Response } from "express";
import paymentService from "../services/payment.service";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response.util";
import { PaymentResponseCode } from "../constants/codes/payment.code";
import { sanitizeData } from "../utils/sanitize.util";
import { findByIdSchema } from "../schemas/shared.schema";
import { Role } from "../constants/db";
import {
  createPaymentConfigSchema,
  createPaymentMethodSchema,
  updatePaymentConfigSchema,
  updatePaymentMethodSchema,
} from "../schemas/payment";
import { AccessTokenPayloadSchema } from "../schemas/jwt.schema";

class PaymentController {
  public async getPayments(req: Request, res: Response) {
    const payments = await paymentService.getPayments();
    const transformed = payments.map((item) => ({
      ...item,
      paymentConfigs: item.paymentConfigs.map((conf) => ({
        ...conf,
        publicConfig: JSON.parse(conf.publicConfig),
        privateConfig: JSON.parse(conf.privateConfig),
      })),
    }));
    res.status(HttpStatus.OK).json(
      successResponse(
        PaymentResponseCode.OK,
        "Lấy phương thức thanh toán thành công",
        sanitizeData(transformed, {
          useDefault: true,
          omit: ["isActive", "privateConfig", "environment"],
        }),
      ),
    );
  }

  public async adminGetAllPayments(req: Request, res: Response) {
    const payments = await paymentService.adminGetPayments();
    const transformed = payments.map((item) => ({
      ...item,
      paymentConfigs: item.paymentConfigs.map((conf) => ({
        ...conf,
        publicConfig: JSON.parse(conf.publicConfig),
      })),
    }));
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          PaymentResponseCode.OK,
          "Lấy danh sách phương thức thanh toán thành công",
          transformed,
        ),
      );
  }

  public async adminGetPaymentDetail(req: Request, res: Response) {
    const {
      params: { id },
    } = findByIdSchema.parse(req);
    const detail = await paymentService.adminGetMethodDetail(id);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          PaymentResponseCode.OK,
          "Lấy thông tin phương thức thanh toán thành công",
          detail,
        ),
      );
  }

  public async adminGetConfigDetail(req: Request, res: Response) {
    const {
      params: { id },
    } = findByIdSchema.parse(req);
    const config = await paymentService.adminGetConfigDetail(id);
    const transformed = {
      ...config,
      publicConfig: JSON.parse(config.publicConfig),
      privateConfig: JSON.parse(config.privateConfig),
    };
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          PaymentResponseCode.OK,
          "Lấy chi tiết cấu hình thành công",
          transformed,
        ),
      );
  }

  public async createPaymentMethod(req: Request, res: Response) {
    const {
      body: { code, desc, isActive, name, position },
    } = createPaymentMethodSchema.parse(req);
    const { sub } = AccessTokenPayloadSchema.parse(res.locals.auth);
    const created = await paymentService.createPaymentMethod({
      code,
      creatorId: sub,
      desc,
      isActive,
      name,
      position,
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          PaymentResponseCode.OK,
          "Tạo phương thức thanh toán thành công",
          created,
        ),
      );
  }

  public async updatePaymentMethod(req: Request, res: Response) {
    const {
      params: { id },
      body: { code, desc, isActive, name, position },
    } = updatePaymentMethodSchema.parse(req);
    const { sub } = AccessTokenPayloadSchema.parse(res.locals.auth);
    const updated = await paymentService.updatePaymentMehtod(id, {
      code,
      name,
      desc,
      isActive,
      position,
      modifierId: sub,
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          PaymentResponseCode.OK,
          "Cập nhật thông tin phương thức thanh toán thành công",
          updated,
        ),
      );
  }

  public async deletePaymentMethod(req: Request, res: Response) {
    const {
      params: { id },
    } = findByIdSchema.parse(req);
    const deleted = await paymentService.deletePaymentMethod(id);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          PaymentResponseCode.OK,
          "Xóa phương thức thanh toán thành công",
          null,
        ),
      );
  }

  public async createPaymentConfig(req: Request, res: Response) {
    const {
      body: {
        paymentMethodId,
        environment,
        isActive,
        privateConfig,
        publicConfig,
      },
    } = createPaymentConfigSchema.parse(req);
    const { sub } = AccessTokenPayloadSchema.parse(res.locals.auth);
    const created = await paymentService.createPaymentConfig({
      creatorId: sub,
      environment,
      isActive,
      paymentMethodId,
      privateConfig,
      publicConfig,
    });
    const transformed = {
      ...created,
      publicConfig: JSON.parse(created.publicConfig),
      privateConfig: JSON.parse(created.privateConfig),
    };

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          PaymentResponseCode.OK,
          "Thêm cấu hình thanh toán thành công",
          transformed,
        ),
      );
  }

  public async updatePaymentConfig(req: Request, res: Response) {
    const {
      params: { id },
      body: { environment, isActive, privateConfig, publicConfig },
    } = updatePaymentConfigSchema.parse(req);
    const { sub } = AccessTokenPayloadSchema.parse(res.locals.auth);

    const updated = await paymentService.updatePaymentConfig(id, {
      environment,
      isActive,
      modifierId: sub,
      publicConfig,
      privateConfig,
    });
    const transformed = {
      ...updated,
      publicConfig: JSON.parse(updated.publicConfig),
      privateConfig: JSON.parse(updated.privateConfig),
    };

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          PaymentResponseCode.OK,
          "Cập nhật cấu hình thành công",
          transformed,
        ),
      );
  }

  public async deletePaymentConfig(req: Request, res: Response) {
    const {
      params: { id },
    } = findByIdSchema.parse(req);
    const deleted = await paymentService.deletePaymentConfig(id);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          PaymentResponseCode.OK,
          "Xóa cấu hình thành công",
          null,
        ),
      );
  }
}

export default new PaymentController();

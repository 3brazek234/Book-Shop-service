import { Context } from "hono";
import { authService } from "./auth.service";
import { LoginInput, RegisterInput } from "../../types/tupes";

export const register = async (c: Context) => {
  try {
    const body: RegisterInput = await c.req.json(); 
    const user = await authService.register(body);
    
    return c.json({ success: true, data: user }, 201);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
};

export const login = async (c: Context) => {
  try {
    const body: LoginInput = await c.req.json();
    const result = await authService.login(body);
    
    return c.json({ success: true, token: result.token }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 401);
  }
};
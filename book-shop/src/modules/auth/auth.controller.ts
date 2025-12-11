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
export const verifyEmail = async (c: Context) => {
  try {
    const body = await c.req.json();
    const result = await authService.verifyOtp(body);   
    return c.json({ success: true, message: result.message }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
};
export const resendOtp = async (c: Context)=>{
    try{
        const body = await c.req.json();
        const result = await authService.resendOtp(body);
        return c.json({ success: true, message: result.message }, 200);
    }catch(error:any){
        return c.json({ success: false, message: error.message }, 400);
    }
}
export const login = async (c: Context) => {
  try {
    const body: LoginInput = await c.req.json();
    const result = await authService.login(body);
    
    return c.json({ success: true, token: result.token, user: result.user }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 401);
  }
};
export const logout = async (c: Context) => {
    try {
    const payload = c.get('jwtPayload'); 
    if (!payload) {
       return c.json({ message: "User not authenticated" }, 401);
    }
    await authService.logout(payload.id);
    return c.json({ success: true, message: "Logged out successfully" }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
};
export const forgetPassword = async (c: Context) => {
  try {
    const body = await c.req.json();
    const result = await authService.forgetPassword(body);
    return c.json({ success: true, message: result.message }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
};
export const resetPassword = async (c: Context) => {
  try {
    const body = await c.req.json();
    const result = await authService.resetPassword(body);
    return c.json({ success: true, message: result.message }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
};